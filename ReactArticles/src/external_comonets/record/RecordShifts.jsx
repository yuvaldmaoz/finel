import { Link } from "react-router-dom";
import classes from "./recoed.module.css";

export default function RecordShifts(props) {
  return (
    <div className={classes.container}>
      <Link to={`/ShiftsView/${props.id}`} className={classes.button}>
        צפייה
      </Link>
      <span className={classes.addText}>
        מספר שיבוץ: {props.id} תאריך: {props.date}
      </span>
    </div>
  );
}
