import React, { useState, useEffect } from "react";
import Window from "../external_comonets/window/window";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function ReturnPage({ id }) {
  const [orders, setOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, [selectedSupplier, startDate, endDate, status]);

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
    let url = "/return/by-supplier";
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
        console.error("Error fetching returns:", error);
      });
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>החזרות מספקים</h1>
        <div className={classes.filterSection}>
          <Link to="/return" className={classes.button}>
            + הוסף החזרה
          </Link>

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

export default ReturnPage;
