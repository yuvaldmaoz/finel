import React, { useEffect, useState } from "react";
import axios from "axios";

import "../assets/styles/MainPage.css";
import Cardlist from "../external_comonets/cardlist/cardlist";
import SimpleBarChart from "../external_comonets/simpleBarChart/SimpleBarChart";
import SimplePieChart from "../external_comonets/simplePieChart/SimplePieChart";
import TableComponent from "../external_comonets/table/table";
import TaskComponent from "../external_comonets/task/task";
import ShiftsTable from "../external_comonets/shiftsTable/ShiftsTable";

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
  const data = [
    { month: "ינואר", client_orders: 24, store_orders: 14 },
    { month: "פברואר", client_orders: 30, store_orders: 10 },
    { month: "מרץ", client_orders: 18, store_orders: 20 },
    { month: "אפריל", client_orders: 22, store_orders: 16 },
  ];

  return (
    <div>
      <Cardlist list={cardList} />
      <div
        className="simple-bar-chart-container"
        style={{ width: "98%", margin: "0 auto" }}
      >
        <h2 className="simple-bar-chart-title">מלאי קריטי</h2>
        <TableComponent data={criticalList} />
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
    </div>
  );
}

export default MainPage;
