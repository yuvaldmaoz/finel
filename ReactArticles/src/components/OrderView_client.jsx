import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderView_client() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`api/orders/client/${id}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>טוען...</div>;
  if (!order) return <div>הזמנה לא נמצאה</div>;

  return (
    <div className="order-details">
      <h2>פרטי הזמנה #{order.id}</h2>
      <div className="order-info">
        <p>תאריך: {new Date(order.date).toLocaleDateString()}</p>
        <p>סטטוס: {order.status}</p>
      </div>
      
      <h3>פריטים בהזמנה:</h3>
      <table className="items-table">
        <thead>
          <tr>
            <th>שם מוצר</th>
            <th>כמות</th>
            <th>מחיר ליחידה</th>
            <th>סה"כ</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₪{item.price}</td>
              <td>₪{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="order-total">
        <h4>סה"כ לתשלום: ₪{order.total}</h4>
      </div>
    </div>
  );
}
