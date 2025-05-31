import React from "react";
import styles from "./task.module.css";

export default function Task({ tasks, onToggleStatus }) {
  return (
    <div className={styles["tasks-list"]}>
      {tasks.map((task) => (
        <div key={task.id} className={styles["task-item"]}>
          <div className={styles["task-content"]}>
            <h2>{task.title}</h2>
            <p className={styles["task-description"]}>
              {task.name}
              <p className={styles["task-date"]}>{task.date}</p>
            </p>
          </div>
          <button
            className={`${styles["task-status"]} ${styles[task.status]}`}
            onClick={() => onToggleStatus(task.id)}
          >
            {task.status === "completed" ? "✓" : "○"}
          </button>
        </div>
      ))}
    </div>
  );
}
