import "./product.css";
import { useState } from "react";

export default function Product({ user, setList, userRole }) {
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

    // הגבלת כמות ללקוח לפי מלאי
    const allowedCount =
      userRole === "client" ? Math.min(count, Quantity) : count;

    setList((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      const totalOrdered = existingItem
        ? existingItem.Quantity + allowedCount
        : allowedCount;

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
            Quantity: allowedCount,
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
      <p className="p_Product">Price: {Price} ₪</p>
      <p className="p_Product">Supplier: {Supplier_Name}</p>
      <p className="p_Product">
        Available Stock:{" "}
        {userRole === "client" ? Quantity - count : Quantity + count}
      </p>
      <p className="p_Product">+Stock: {count}</p>

      <input
        type="number"
        className="product-input"
        placeholder="הכנס כמות"
        value={count}
        max={userRole === "client" ? Quantity : 100}
        onChange={(e) =>
          setCount(
            Math.min(
              userRole === "client" ? Quantity : 100,
              parseInt(e.target.value) || 0
            )
          )
        }
      />

      <button className="product-button" onClick={addToList}>
        הוסף לרשימה
      </button>
    </div>
  );
}
