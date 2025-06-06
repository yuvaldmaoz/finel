import { Link } from "react-router-dom";
import classes from "./recoed.module.css";

export default function RecordShifts(props) {
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.supplier}>מספר שיבוץ: {props.id}</div>
        <div className={classes.details}>תאריך: {props.date}</div>
      </div>
      <Link to={`/ShiftsView/${props.id}`} className={classes.button}>
        צפייה
      </Link>
    </div>
  );
}
