import "./product.css";
import { useState } from "react";

export default function Product({ user, setList }) {
  const {
    id,
    Supplier_Name,

    Price,
    Category,
    Product_Name,
    Quantity,
    Expiration_Date,
  } = user;

  const [count, setCount] = useState(0); // כמות שהמשתמש רוצה להזמין

  function addToList() {
    if (count <= 0) return;

    setList((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      const totalOrdered = existingItem ? existingItem.Quantity + count : count;

      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, Quantity: totalOrdered } : item
        );
      } else {
        return [
          ...prev,
          {
            id,
            Supplier_Name,
            Price,
            Category,
            Product_Name,
            Quantity: count,
            Expiration_Date,
          },
        ];
      }
    });

    setCount(0); // איפוס שדה הקלט לאחר ההוספה
  }

  return (
    <div className={`Product ${Quantity < 5 ? "low-stock" : ""}`}>
      <p className="p_Product">Name: {Product_Name}</p>
      {/* <p className="p_Product">ID: {id}</p> */}
      <p className="p_Product">Price: {Price * 1} ₪</p>
      <p className="p_Product">Supplier: {Supplier_Name}</p>
      {/* <p className="p_Product">Expiration Date: {Expiration_Date}</p> */}
      <p className="p_Product">Available Stock: {Quantity + count}</p>
      <p className="p_Product">+Stock: {count}</p>

      <input
        type="number"
        className="product-input"
        placeholder="הכנס כמות"
        value={count}
        max="100"
        onChange={(e) => setCount(Math.min(100, parseInt(e.target.value) || 0))}
      />

      <button className="product-button" onClick={addToList}>
        הוסף לרשימה
      </button>
    </div>
  );
}
