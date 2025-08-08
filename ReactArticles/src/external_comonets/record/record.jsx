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
      <div>
        <div className={classes.supplier}>
          {props.supplier} | {props.status}
        </div>
        <div className={classes.details}>
          מספר הזמנה: {props.id} | תאריך: {props.date}
        </div>
      </div>
      {/* 🔄 כפתור חדש לצפייה בפרטי ההזמנה */}
      <Link to={`/return/${props.id}`} className={classes.button}>
        צפייה
      </Link>
    </div>
  );
}
