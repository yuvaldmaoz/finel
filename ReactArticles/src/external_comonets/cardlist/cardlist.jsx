import Card from "../card/Caed";
import classes from "./cardlist.module.css";

export default function Cardlist(props) {
  const cardList = props.list;

  return (
    <div className={classes.container}>
      {cardList.map((element, ind) => (
        <div key={element.id} className={classes.cardWrapper}>
          <Card user={element} index={ind} />
        </div>
      ))}
    </div>
  );
}
