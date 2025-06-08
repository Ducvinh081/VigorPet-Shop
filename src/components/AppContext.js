'use client'
import { createContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";

// Define cartProductPrice outside the component so it can be imported directly
// and also passed through context for convenience.
export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  // If product has a quantity property, multiply the price by it
  // This is crucial for correctly calculating the total price of a cart item
  // that represents multiple units.
  return price * (cartProduct.quantity || 1); // IMPORTANT: Multiply by quantity here
}


export const CartContext = createContext({
  cartProducts: [],
  // Explicitly define signature for clarity in context consumers
  addToCart: (product, size = null, extras = [], quantity = 1) => {},
  removeFromCart: (indexToRemove) => {},
  updateCartProductQuantity: (index, delta) => {}, // Function to update quantity
  clearCart: () => {},
  cartProductPrice: (product) => 0, // Add cartProductPrice to context definition
});

export function AppProvider({ children, session }) {
  const [cartProducts, setCartProducts] = useState(() => {
    // Chạy khối này 1 lần khi mount để khởi tạo state ban đầu
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Ensure each parsed item has a quantity, default to 1 if missing
      // Also, re-calculate the price based on original properties if necessary (though cartProductPrice handles it now)
      return Array.isArray(parsed) ? parsed.map(item => ({ ...item, quantity: item.quantity || 1 })) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  // Mỗi khi cartProducts thay đổi, lưu lại vào localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cart", JSON.stringify(cartProducts));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartProducts]); // Dependency on cartProducts

  function clearCart() {
    setCartProducts([]);
    // localStorage sẽ tự động được cập nhật qua useEffect
    toast.success("Đã xóa hết giỏ hàng");
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter(
        (_, index) => index !== indexToRemove
      );
      toast.success("Đã xóa sản phẩm");
      return newCartProducts;
    });
  }

  // MODIFIED addToCart to store quantity directly on the item
  function addToCart(product, size = null, extras = [], quantity = 1) {
    setCartProducts((prevProducts) => {
      // Create a single cart product object with the specified quantity
      const cartProductToAdd = { ...product, size, extras, quantity: quantity };

      // Optional: If you want to merge identical items (same product, size, and extras)
      // instead of adding new line items, you'd implement that logic here.
      // For now, it adds a new line item even if product is identical.
      // Example of merging:
      /*
      const existingProductIndex = prevProducts.findIndex(p =>
        p._id === product._id &&
        JSON.stringify(p.size) === JSON.stringify(size) &&
        JSON.stringify(p.extras) === JSON.stringify(extras)
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + quantity
        };
        toast.success(`Đã cập nhật số lượng ${quantity} cho sản phẩm.`);
        return updatedProducts;
      } else {
        toast.success(`${quantity} sản phẩm đã được thêm vào giỏ hàng`);
        return [...prevProducts, cartProductToAdd];
      }
      */

      // Current logic: Always add as a new line item (which is what your CartProduct and CartPage expect now)
      toast.success(`${quantity} sản phẩm đã được thêm vào giỏ hàng`);
      return [...prevProducts, cartProductToAdd];
    });
  }

  // NEW: Function to update quantity for a specific item in the cart
  function updateCartProductQuantity(indexToUpdate, delta) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = [...prevCartProducts];
      if (newCartProducts[indexToUpdate]) {
        const currentQuantity = newCartProducts[indexToUpdate].quantity || 1;
        const newQuantity = Math.max(1, currentQuantity + delta); // Ensure quantity is at least 1

        if (newQuantity !== currentQuantity) { // Only update if quantity actually changes
          newCartProducts[indexToUpdate] = {
            ...newCartProducts[indexToUpdate],
            quantity: newQuantity,
          };
          toast.success(`Số lượng đã cập nhật cho ${newCartProducts[indexToUpdate].name}`);
        }
      }
      return newCartProducts;
    });
  }


  return (
    <SessionProvider session={session}>
      <CartContext.Provider
        value={{
          cartProducts,
          addToCart,
          removeCartProduct,
          updateCartProductQuantity, // Expose the new function
          clearCart,
          cartProductPrice, // Pass cartProductPrice through context
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}