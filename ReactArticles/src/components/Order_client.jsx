import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TableComponent from "../external_comonets/table/table";
import Product from "../external_comonets/product/product";

export default function Order_client() {
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = () => {
    axios.get(`api/products?search=${searchTerm}&category=${selectedCategory}`)
      .then(res => setProductList(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmitOrder = () => {
    if (orderList.length === 0) {
      alert("נא לבחור מוצרים להזמנה");
      return;
    }

    axios.post("api/orders/client", { items: orderList })
      .then(() => {
        alert("ההזמנה נשלחה בהצלחה!");
        navigate("/client/orders");
      })
      .catch(err => alert("שגיאה בשליחת ההזמנה"));
  };

  return (
    <div className="order-container">
      <h2>הזמנה חדשה</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="חיפוש מוצר..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TableComponent data={orderList} />
      
      <button onClick={handleSubmitOrder} className="submit-btn">
        שלח הזמנה
      </button>

      <div className="products-grid">
        {productList.map(product => (
          <Product key={product.id} user={product} setList={setOrderList} />
        ))}
      </div>
    </div>
  );
}
