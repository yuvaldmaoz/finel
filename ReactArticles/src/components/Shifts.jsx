import React, { useEffect, useState } from "react";
import axios from "axios";
import WindowShifts from "../external_comonets/window/WindowShifts";
import { Link } from "react-router-dom";
import classes from "../external_comonets/window/window.module.css";

function Shifts() {
  const [shiftsData, setShiftsData] = useState([]);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = () => {
    axios
      .get("/Shift")
      .then((response) => {
        setShiftsData(response.data);
        window.Shift = response.data;
      })
      .catch((error) => {
        console.error("Error fetching shifts:", error);
      });
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>שיבוצים</h1>
        <Link to="/add-shift" className={classes.button}>
          + הוסף שיבוץ
        </Link>
      </div>
      <WindowShifts header="שיבוצים" record={shiftsData} />
    </div>
  );
}

export default Shifts;
