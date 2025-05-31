import React, { useState, useEffect } from "react";
import Window from "../external_comonets/window/window";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("/orders")
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
        <Link to="/Order" className={classes.button}>
          + הוסף הזמנה
        </Link>
      </div>
      <Window record={orders} />
    </div>
  );
}

export default OrdersPage;
