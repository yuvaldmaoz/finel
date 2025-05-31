import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskComponent from "../external_comonets/task/task";
import ShiftsTable from "../external_comonets/shiftsTable/ShiftsTable";
import TableComponent from "../external_comonets/table/table";

function EmployeePage({ username }) {
  const [tasks, setTasks] = useState([]);
  const [Shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchData();
    // fetchNameList(); // אם צריך, השאר. אם לא, הסר.
  }, []);

  const fetchData = () => {
    axios
      .get(`dashboard_employee?name=${username}`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchShiftsData();
    // fetchNameList(); // אם צריך, השאר. אם לא, הסר.
  }, []);

  const fetchShiftsData = () => {
    axios
      .get(`dashboard_employee/Shift?name=${username}`)
      .then((res) => {
        setShifts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
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

  const [criticalList, setcriticalList] = useState([]);

  // Removed unused candlesList state
  useEffect(() => {
    fetchcriticalData();
  }, []);

  const fetchcriticalData = () => {
    axios
      .get("Dashboard/critical")
      .then((res) => {
        setcriticalList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  return (
    <div>
      <div
        className="simple-bar-chart-container"
        style={{
          width: "98%",
          margin: "20px auto 0 auto",
          display: "block",
        }}
      >
        <h2 className="simple-bar-chart-title">משימות שלי</h2>
        <div className="task-scroll-area">
          <TaskComponent tasks={tasks} onToggleStatus={toggleTaskStatus} />
        </div>
      </div>
      <div
        className="simple-bar-chart-container"
        style={{ width: "98%", margin: "20px auto 0 auto" }}
      >
        <h2 className="simple-bar-chart-title">שיבוצים שלי</h2>
        <ShiftsTable data={Shifts} />
      </div>
      <div
        className="simple-bar-chart-container"
        style={{ width: "98%", margin: "20px auto 0 auto" }}
      >
        <h2 className="simple-bar-chart-title">מלאי קריטי</h2>
        <TableComponent data={criticalList} />
      </div>
    </div>
  );
}

export default EmployeePage;
