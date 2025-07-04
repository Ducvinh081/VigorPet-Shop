import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import {useEffect, useState} from "react";

export default function MenuItemForm({onSubmit,menuItem}) {
  const [image, setImage] = useState(menuItem?.image || '');
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || '');
  const [categories, setCategories] = useState([]);
  const [
    extraIngredientPrices,
    setExtraIngredientPrices,
  ] = useState(menuItem?.extraIngredientPrices || []);
  const [isNull, setIsNull] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }, []);

  return (
    <form
      onSubmit={ev =>
        onSubmit(ev, {
          image,name,description,basePrice,sizes,extraIngredientPrices,category,
        })
      }
      className="mt-8 max-w-2xl mx-auto">
      <div
        className="md:grid items-start gap-4"
        style={{gridTemplateColumns:'.3fr .7fr'}}>
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>
        <div className="grow">
          <label>Tên</label>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          <label>Miêu tả</label>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          <label>Danh mục</label>
          <select value={category} onChange={ev => setCategory(ev.target.value)}>
            {categories?.length > 0 && categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <label>Giá</label>
          <input
            type="text"
            value={basePrice}
            onChange={ev => setBasePrice(ev.target.value)}
          />
          <MenuItemPriceProps name={"Tên"}
                              addLabel={"Chọn size "}
                              props={sizes}
                              setProps={setSizes} />
          <button type="submit">{"Lưu"}</button>
        </div>
      </div>
    </form>
  );
}