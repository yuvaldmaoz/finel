import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExportReport from "../external_comonets/ExportReport/ExportReport";
import TableComponent from "../external_comonets/table/table";
import classes from "../external_comonets/window/window.module.css";

function ReturnView({ userRole }) {
  const { id } = useParams();
  const [returnDetails, setReturnDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReturnData = () => {
    setLoading(true);
    axios
      .get(`/return/details/${id}`)
      .then((res) => {
        setReturnDetails(res.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching return details:", error);
        setError("שגיאה בטעינת פרטי ההחזרה");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReturnData();
  }, [id]);

  const handleCloseReturn = () => {
    axios
      .post(`/return/${id}/close`)
      .then(() => {
        fetchReturnData();
      })
      .catch((error) => {
        console.error("Error closing return:", error);
      });
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  const totalRefund = returnDetails
    .reduce((total, item) => {
      const price = parseFloat(item.Price);
      const quantity = parseInt(item.Quantity, 10);
      return total + price * quantity;
    }, 0)
    .toFixed(2);

  return (
    <div className="main">
      <section className="post">
        <div className="container">
          <h1 className="post-title">החזרה מספר {id}</h1>

          <div className="single-post">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: 0 }}>סה"כ זיכוי: ₪{totalRefund}</p>
              <ExportReport list={returnDetails} />
            </div>

            <button
              style={{
                margin: 0,
                marginLeft: "auto",
                display: "block",
              }}
              className={classes.button}
              onClick={handleCloseReturn}
            >
              סגור החזרה
            </button>

            <TableComponent data={returnDetails} role={userRole} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReturnView;
