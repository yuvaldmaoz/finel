import React, { useState, useEffect } from "react";
import Window from "../external_comonets/window/window";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, [selectedSupplier, startDate, endDate]);

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
        console.error("Error fetching orders:", error);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>הזמנות</h1>
        <div className={classes.filterSection}>
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
          <Link to="/Order" className={classes.button}>
            + הוסף הזמנה
          </Link>
        </div>
      </div>
      <Window record={orders} />
    </div>
  );
}

export default OrdersPage;
