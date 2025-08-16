import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UsersComponent from "../external_comonets/task/UsersComponent";
import axios from "axios";
import styles from "../external_comonets/task/task.module.css"; // ודא שהנתיב נכון

export default function UserPage() {
  const [users, setusers] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("users")
      .then((res) => {
        setusers(res.data); // תיקון כאן
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };




  return (
    <div className={styles["tasker-container"]}>
      <div
        className={`${styles["tasker-header"]} ${styles["tasker-header-reverse"]}`}
      >
        <h1>משתמשים</h1>
        <Link to="/register" className={styles["new-task-btn"]}>
          + הוסף עובד
        </Link>
      </div>
      <div className="container">
        <UsersComponent users={users} />
      </div>
    </div>
  );
}

