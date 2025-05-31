import "./Card.css";

export default function Card({ user, index }) {
  const images = [
    "https://cdn-icons-png.flaticon.com/512/4388/4388193.png",

    "https://icon-library.com/images/task-icon/task-icon-0.jpg",
    "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
  ];

  const { tables, total_objects } = user;

  return (
    <div className="Card">
      <img src={images[index]} className="img_card" />
      <p className="p_Card">{tables}</p>
      <p className="p_Card">{total_objects}</p>
    </div>
  );
}
