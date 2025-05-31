import Recordlist_Shifts from "../Recordlist/Recordlist_Shifts";
import classes from "./window.module.css";

/**
 * description: WindowShifts component displaying shifts
 * @returns JSX of component
 */
export default function WindowShifts(props) {
  const list = props.record;

  return (
    <div className={classes.container}>
      <Recordlist_Shifts record_list={list} />
    </div>
  );
}
