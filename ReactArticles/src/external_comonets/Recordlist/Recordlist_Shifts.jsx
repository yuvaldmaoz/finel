import RecordShifts from "../record/RecordShifts";
import classes from "./Recordlist.module.css";

export default function Recordlist_Shifts(props) {
  const list = props.record_list;

  return (
    <div className={classes.recordsContainer}>
      {list.map((item, index) => (
        <RecordShifts key={index} id={item.id} date={item.week_start_date} />
      ))}
    </div>
  );
}
