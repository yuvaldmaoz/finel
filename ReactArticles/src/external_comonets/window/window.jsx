import Recordlist from "../Recordlist/Recordlist";
import classes from "./window.module.css";

/**
 * description: Window component displaying orders
 * @returns JSX of component
 */
export default function Window(props) {
  const list = props.record;

  return (
    <div className={classes.container}>
      <Recordlist record_list={list} />
    </div>
  );
}
