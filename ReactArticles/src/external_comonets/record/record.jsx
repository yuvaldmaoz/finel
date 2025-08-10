import React from "react";
import { Link } from "react-router-dom";
import classes from "./recoed.module.css";

/**
 * description: Record component displaying order or return details
 * @returns JSX of component
 */
export default function Record(props) {
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.supplier}>
          {props.role === "admin" && (
            <div className={classes.supplier}>
              {props.supplier} | {props.status}
            </div>
          )}{" "}
        </div>
        <div className={classes.details}>
          מספר {props.type === "Orders" ? "הזמנה" : "החזרה"}: {props.id} |
          תאריך: {props.date}
        </div>
      </div>

      {props.type === "Orders" ? (
        <Link to={`/Order/${props.id}`} className={classes.button}>
          צפייה
        </Link>
      ) : props.type === "Returns" ? (
        <Link to={`/return/${props.id}`} className={classes.button}>
          צפייה
        </Link>
      ) : null}
    </div>
  );
}
