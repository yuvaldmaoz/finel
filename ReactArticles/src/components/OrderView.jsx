import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExportReport from "../external_comonets/ExportReport/ExportReport";
import TableComponent from "../external_comonets/table/table";

function OrderView({ userRole }) {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const endpoint =
      userRole === "client" ? `/client/${id}` : `/orders/details/${id}`;

    axios
      .get(endpoint)
      .then((res) => {
        setOrderDetails(res.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setError("שגיאה בטעינת פרטי ההזמנה");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [id, userRole]);

  const handleCloseOrder = () => {
    axios
      .post(`/orders/${id}/close`)
      .then(() => {
        fetchData(); // רענון הנתונים לאחר סגירה
      })
      .catch((error) => {
        console.error("Error closing order:", error);
      });
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  const totalPrice = orderDetails
    .reduce((total, order) => {
      const price = parseFloat(order.Price);
      const quantity = parseInt(order.Quantity, 10);
      return total + price * quantity;
    }, 0)
    .toFixed(2);

  return (
    <div className="main">
      <section className="post">
        <div className="container">
          <h1 className="post-title">
            {userRole === "client" ? "פרטי הזמנה מספר" : "הזמנה מספק מספר"} {id}
          </h1>

          <div className="single-post">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: 0 }}>סה"כ לתשלום: ₪{totalPrice}</p>
              {userRole === "admin" && <ExportReport list={orderDetails} />}
            </div>

            {userRole === "admin" && (
              <button onClick={handleCloseOrder}>סגור הזמנה</button>
            )}

            <TableComponent data={orderDetails} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderView;
