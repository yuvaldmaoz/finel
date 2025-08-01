import React, { useState, useEffect } from "react";
import TaskComponent from "../external_comonets/task/task";
import AddTaskPopup from "./AddTaskPopup";
import axios from "axios";
import styles from "../external_comonets/task/task.module.css"; // ודא שהנתיב נכון

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchNameList();
  }, []);

  const fetchData = () => {
    axios
      .get("task")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const fetchNameList = () => {
    axios
      .get("users/name")
      .then((res) => {
        setNameList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const addNewTask = (taskData) => {
    axios
      .post("task", taskData)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const toggleTaskStatus = (taskId) => {
    axios
      .post(`task/${taskId}`)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  return (
    <div className={styles["tasker-container"]}>
      <div className={styles["tasker-header"]}>
        <h1>משימות</h1>
        <button
          className={styles["new-task-btn"]}
          onClick={() => setShowAddPopup(true)}
        >
          + הוסף משימה
        </button>
      </div>
      <div className="container">
        <TaskComponent tasks={tasks} onToggleStatus={toggleTaskStatus} />
        {showAddPopup && (
          <AddTaskPopup
            onAdd={addNewTask}
            onClose={() => setShowAddPopup(false)}
            employeeList={nameList}
          />
        )}
      </div>
    </div>
  );
}
