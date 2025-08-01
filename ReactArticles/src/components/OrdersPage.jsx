import React, { useState, useEffect } from "react";
import Window from "../external_comonets/window/window";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function OrdersPage({ userRole, id }) {
  const [orders, setOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all"); // 🔄 חדש

  useEffect(() => {
    fetchOrders();
    if (userRole === "admin") {
      fetchSuppliers();
    }
  }, [selectedSupplier, startDate, endDate, status, userRole]); // 🔄 הוספנו status לתלות

  const fetchSuppliers = () => {
    axios
      .get("/suppliers")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  const fetchOrders = () => {
    if (userRole === "client") {
      let url = "/client";
      const params = new URLSearchParams();

      params.append("user_id", id);

      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      if (status !== "all") {
        params.append("status", status);
      }

      const queryString = params.toString();
      url += `?${queryString}`;

      axios
        .get(url)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching client orders:", error);
        });
    } else {
      let url = "/orders/by-supplier";
      const params = new URLSearchParams();

      if (selectedSupplier !== "all") {
        params.append("supplier", selectedSupplier);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      if (status !== "all") {
        params.append("status", status);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      axios
        .get(url)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching supplier orders:", error);
        });
    }
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>
          {userRole === "client" ? "ההזמנות שלי" : "הזמנות מספקים"}
        </h1>
        <div className={classes.filterSection}>
          <Link
            to={userRole === "client" ? "/client/order" : "/Order"}
            className={classes.button}
          >
            + הוסף הזמנה
          </Link>
          {userRole === "admin" && (
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className={classes.filterInput}
            >
              <option value="all">כל הספקים</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
          )}

          {/* 🔄 Select חדש לסטטוס ההזמנה */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={classes.filterInput}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="open">פתוחה</option>
            <option value="closed">סגורה</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={classes.filterInput}
            placeholder="תאריך התחלה"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={classes.filterInput}
            placeholder="תאריך סיום"
          />
        </div>
      </div>
      <Window record={orders} />
    </div>
  );
}

export default OrdersPage;
