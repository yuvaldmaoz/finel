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

  const fetchData = () => {
    axios
      .get("Dashboard/candles")
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

  const fetchTaskData = () => {
    axios
      .get("Dashboard/cake")
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
        <TableComponent data={criticalList} />
      </div>

      <div className="charts-row">
        <SimpleBarChart data={candlesList} />
        <SimplePieChart data={taskCountList} />
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
