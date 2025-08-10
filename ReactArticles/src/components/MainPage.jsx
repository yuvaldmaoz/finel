import React, { useEffect, useState } from "react";
import axios from "axios";

import "../assets/styles/MainPage.css";
import Cardlist from "../external_comonets/cardlist/cardlist";
import SimpleBarChart from "../external_comonets/simpleBarChart/SimpleBarChart";
import SimplePieChart from "../external_comonets/simplePieChart/SimplePieChart";
import TableComponent from "../external_comonets/table/table";
import TaskComponent from "../external_comonets/task/task";
import ShiftsTable from "../external_comonets/shiftsTable/ShiftsTable";
import classes from "../external_comonets/window/window.module.css";
import { Link } from "react-router-dom";

function MainPage({ username }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchtasksData();
  }, []);

  const fetchtasksData = () => {
    axios

      .get(`dashboard_employee?name=${username}`)
      .then((res) => {
        setTasks(res.data);
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
  const [criticalFilter, setCriticalFilter] = useState("all"); // אפשרויות: all, Quantity, Expiration_Date

  useEffect(() => {
    fetchcriticalData();
  }, [criticalFilter]);

  const fetchcriticalData = () => {
    axios
      .get("Dashboard/critical", {
        params: {
          filter: criticalFilter,
        },
      })
      .then((res) => {
        setcriticalList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const [cardList, setcardList] = useState([]);

  useEffect(() => {
    fetchcardData();
  }, []);

  const fetchcardData = () => {
    axios
      .get("Dashboard/card")
      .then((res) => {
        setcardList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const [candlesList, setcandlesList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const [dateRange, setDateRange] = useState({
    from: new Date().getFullYear() + "-01", // Default to current year, January
    to: new Date().getFullYear() + "-12", // Default to current year, December
  });

  const fetchData = () => {
    axios
      .get("Dashboard/candles", {
        params: {
          from: dateRange.from,
          to: dateRange.to,
        },
      })
      .then((res) => {
        setcandlesList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const [taskCountList, setTaskCountList] = useState([]);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const [taskDateRange, setTaskDateRange] = useState({
    from: new Date().getFullYear() + "-01-01", // Format: YYYY-MM-DD
    to: new Date().getFullYear() + "-12-31", // Format: YYYY-MM-DD
  });

  const fetchTaskData = () => {
    // וידוא שהתאריכים נשלחים בפורמט הנכון
    const fromDate =
      taskDateRange.from + (taskDateRange.from.length === 7 ? "-01" : "");
    const toDate =
      taskDateRange.to + (taskDateRange.to.length === 7 ? "-31" : "");

    axios
      .get("Dashboard/cake", {
        params: {
          from: fromDate,
          to: toDate,
        },
      })
      .then((res) => {
        setTaskCountList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching task data:", error);
      });
  };

  const [Shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchShiftsData();
  }, []);

  const fetchShiftsData = () => {
    axios
      .get(`dashboard_employee/Shift?name=${username}`)
      .then((res) => {
        setShifts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching shifts:", error);
      });
  };

  return (
    <div>
      <Cardlist list={cardList} />
      <div
        className="simple-bar-chart-container"
        style={{ width: "98%", margin: "0 auto" }}
      >
        <h2 className="simple-bar-chart-title">מלאי קריטי</h2>

        <div>
          <select
            value={criticalFilter}
            onChange={(e) => {
              setCriticalFilter(e.target.value);
              fetchcriticalData();
            }}
            className={classes.filterInput}
          >
            <option value="all">הכל</option>
            <option value="Quantity">כמות נמוכה</option>
            <option value="Expiration_Date">תוקף קרוב</option>
          </select>
        </div>
        {criticalList.length === 0 ? (
          <div className={classes.emptyMessage}>אין מוצרים קריטיים</div>
        ) : (
          <>
            <TableComponent data={criticalList} />

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              {criticalFilter === "Expiration_Date" && (
                <Link to="/return" className={classes.button}>
                  + הוסף החזרה
                </Link>
              )}
              {(criticalFilter === "Quantity" || criticalFilter === "all") && (
                <Link to="/Order" className={classes.button}>
                  + הוסף הזמנה
                </Link>
              )}
            </div>
          </>
        )}
      </div>
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

      <div className="charts-row">
        <SimpleBarChart
          data={candlesList}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onDateChange={fetchData}
        />
        <SimplePieChart
          data={taskCountList}
          dateRange={taskDateRange}
          setDateRange={setTaskDateRange}
          onDateChange={fetchTaskData}
        />
      </div>

      <div
        className="simple-bar-chart-container"
        style={{ width: "98%", margin: "20px auto 0 auto" }}
      >
        <h2 className="simple-bar-chart-title">שיבוצים שלי</h2>
        <ShiftsTable data={Shifts} />
      </div>
    </div>
  );
}

export default MainPage;
