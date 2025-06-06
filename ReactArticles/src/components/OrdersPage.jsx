import React, { useState, useEffect } from "react";
import Window from "../external_comonets/window/window";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, [selectedSupplier]); // Now watching selectedSupplier

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
    const url =
      selectedSupplier === "all" ? "/orders" : `/orders/${selectedSupplier}`;

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
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className={classes.button}
          style={{ marginLeft: "10px" }}
        >
          <option value="all">כל הספקים</option>
          {suppliers.map((supplier, index) => (
            <option key={index} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        <Link to="/Order" className={classes.button}>
          + הוסף הזמנה
        </Link>
      </div>
      <Window record={orders} />
    </div>
  );
}

export default OrdersPage;
