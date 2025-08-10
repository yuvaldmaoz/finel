import Recordlist from "../Recordlist/Recordlist";
import classes from "./window.module.css";

/**
 * description: Window component displaying orders
 * @returns JSX of component
 */
export default function Window(props) {
  const list = props.record;
  const type = props.type;
  const userRole = props.role;

  return (
    <div className={classes.container}>
      <Recordlist record_list={list} type={type} role={userRole} />
    </div>
  );
}
