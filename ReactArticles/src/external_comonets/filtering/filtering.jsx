import "./filtering.css";

export default function Filtering(props) {
  const buttons = props.list;

  return (
    <div className="filtering-container">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className="filter-button"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
