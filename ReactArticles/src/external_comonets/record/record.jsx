import React from "react";
import { Link } from "react-router-dom";
import classes from "./recoed.module.css";

/**
 * description: Record component displaying order details
 * @returns JSX of component
 */
export default function Record(props) {
  return (
    <div className={classes.container}>
      <Link to={`/order/${props.id}`} className={classes.button}>
        צפייה
      </Link>
      <span className={classes.addText}>
        מספר הזמנה: {props.id} תאריך: {props.date}
      </span>
    </div>
  );
}
