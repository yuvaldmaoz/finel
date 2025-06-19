import Record from "../record/record";
import classes from "./Recordlist.module.css";

export default function Recordlist(props) {
  const list = props.record_list;

  return (
    <div className={classes.recordsContainer}>
      {list.map((item, index) => (
        <Record
          key={index}
          id={item.id}
          date={item.created_at}
          supplier={item.supplier_name}
          status={item.status}
        />
      ))}
    </div>
  );
}
