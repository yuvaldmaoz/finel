import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShiftsTable from "../external_comonets/shiftsTable/ShiftsTable";

function ShiftsView() {
  const { id } = useParams();
  const [shiftDetails, setShiftDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`/Shift/${id}`)
      .then((res) => {
        setShiftDetails(res.data);
      })
      .catch((error) => {
        console.error("Error fetching shift details:", error);
      });
  }, [id]);

  return (
    <div className="main">
      <section className="post">
        <div className="container">
          <h1 className="post-title">שיבוץ מספר {id}</h1>
          <div className="single-post">
            <ShiftsTable data={shiftDetails} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShiftsView;
