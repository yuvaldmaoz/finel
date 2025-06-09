import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderView_client() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = () => {
    axios.get(`orders/client/${id}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  };

  if (!order) return <div>טוען...</div>;

  return (
    <div className="order-details-container">
      <h2>פרטי הזמנה מספר {id}</h2>
      <div className="order-info">
        <p>תאריך: {new Date(order.date).toLocaleDateString()}</p>
        <p>סטטוס: {order.status}</p>
      </div>
      <div className="order-items">
        <h3>פריטים בהזמנה:</h3>
        <table>
          <thead>
            <tr>
              <th>שם המוצר</th>
              <th>כמות</th>
              <th>מחיר ליחידה</th>
              <th>סה"כ</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}₪</td>
                <td>{item.quantity * item.price}₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
