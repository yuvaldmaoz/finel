import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import Filtering from "../external_comonets/filtering/filtering";
import ExportReport from "../external_comonets/ExportReport/ExportReport";

function Inventory() {
  const [list, setlist] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("products")
      .then((res) => {
        setlist(res.data);
        setOriginalList(res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const buttons = [
    { label: "Dairy  ", onClick: () => filterByCategory("Dairy") },
    { label: "Bakery   ", onClick: () => filterByCategory("Bakery") },
    {
      label: "Fruits and Vegetables",
      onClick: () => filterByCategory("Fruits and Vegetables"),
    },
    { label: "Cleaning  ", onClick: () => filterByCategory("Cleaning") },
    { label: "הצג הכל", onClick: () => setlist(originalList) },
  ];

  function filterByCategory(text) {
    setlist(originalList.filter((el) => el.Category === text));
  }

  return (
    <div className="main">
      <div className="container">
        <div className="articles-container">
          <Filtering list={buttons} />
          <ExportReport list={list} />
          <TableComponent data={list} />
        </div>
      </div>
    </div>
  );
}

export default Inventory;
