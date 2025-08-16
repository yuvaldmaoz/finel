import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UsersComponent from "../external_comonets/task/UsersComponent";
import axios from "axios";
import classes from "../external_comonets/window/window.module.css";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("all");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchData();
  }, [role, name]);

  const fetchData = () => {
    const params = new URLSearchParams({ role, name });

    axios
      .get(`users?${params.toString()}`)
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>משתמשים</h1>

        <div className={classes.filterSection}>
          <Link to="/register" className={classes.button}>
            + הוסף עובד
          </Link>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={classes.filterInput}
          >
            <option value="all">כל התפקידים</option>
            <option value="admin">מנהל</option>
            <option value="employe">עובדים</option>
            <option value="client">לקוחות</option>
          </select>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classes.filterInput}
            placeholder="שם משתמש"
          />
        </div>
      </div>
      <div className="container">
        <UsersComponent users={users} />
      </div>
    </div>
  );
}
