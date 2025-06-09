import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrdersPage_client() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("api/orders/client")
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>טוען...</div>;

  return (
    <div className="orders-container">
      <h2>ההזמנות שלי</h2>
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <h3>הזמנה #{order.id}</h3>
            <p>תאריך: {new Date(order.date).toLocaleDateString()}</p>
            <p>סטטוס: {order.status}</p>
            <Link to={`/client/order/${order.id}`} className="view-btn">
              צפה בפרטים
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
