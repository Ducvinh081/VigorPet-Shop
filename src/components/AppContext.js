'use client'
import { createContext, useEffect, useState } from "react";
import { SessionProvider,useSession  } from "next-auth/react";
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

// Tách riêng CartProvider ra khỏi SessionProvider
export function CartProvider({ children }) {
  const { data: session, status } = useSession();
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

  function resetCartProducts() {
    setCartProducts([]);
    // Show toast after state update
    setTimeout(() => {
    }, 0);
  }
  function clearCart() {
    setCartProducts([]);
    // Show toast after state update
    setTimeout(() => {
      toast.success("Đã xóa hết giỏ hàng");
    }, 0);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter(
        (_, index) => index !== indexToRemove
      );
      return newCartProducts;
    });
    // Show toast after state update
    setTimeout(() => {
      toast.success("Đã xóa sản phẩm");
    }, 0);
  }

  // MODIFIED addToCart to merge products with same ID, size, and extras
  function addToCart(product, size = null, extras = [], quantity = 1) {
    setCartProducts((prevProducts) => {
      // Find existing product with same ID, size, and extras
      const existingProductIndex = prevProducts.findIndex(p =>
        p._id === product._id &&
        JSON.stringify(p.size) === JSON.stringify(size) &&
        JSON.stringify(p.extras) === JSON.stringify(extras)
      );

      if (existingProductIndex !== -1) {
        // Update existing product quantity
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: (updatedProducts[existingProductIndex].quantity || 1) + quantity
        };
        return updatedProducts;
      } else {
        // Add new product
        const cartProductToAdd = { ...product, size, extras, quantity: quantity };
        return [...prevProducts, cartProductToAdd];
      }
    });
    // Show toast after state update
    setTimeout(() => {
    }, 0);
  }

  // NEW: Function to update quantity for a specific item in the cart
  function updateCartProductQuantity(indexToUpdate, delta) {
    let productName = '';
    let quantityChanged = false;
    
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
          productName = newCartProducts[indexToUpdate].name;
          quantityChanged = true;
        }
      }
      return newCartProducts;
    });

    // Show toast after state update if quantity was changed
    if (quantityChanged) {
      setTimeout(() => {
      }, 0);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeCartProduct,
        updateCartProductQuantity, // Expose the new function
        clearCart,
        cartProductPrice, // Pass cartProductPrice through context
        resetCartProducts
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// AppProvider bây giờ chỉ wrap SessionProvider và CartProvider
export function AppProvider({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}