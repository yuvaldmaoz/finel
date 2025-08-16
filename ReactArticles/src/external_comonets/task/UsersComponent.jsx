import React from "react";
import styles from "./task.module.css";

export default function UsersComponent({ users }) {
  return (
    <div className={styles["tasks-list"]}>
      {users.map((user) => (
        <div key={user.id} className={styles["task-item"]}>
          <div className={styles["task-content"]}>
            <h2>{user.name}</h2>
            <p className={styles["task-description"]}>{user.email}</p>
            <span className={styles["task-date"]}>{user.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
