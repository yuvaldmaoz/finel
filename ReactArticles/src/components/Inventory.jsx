import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import ExportReport from "../external_comonets/ExportReport/ExportReport";

function Inventory() {
  const [list, setlist] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = () => {
    axios
      .get(`products/search?name=${searchTerm}`)
      .then((res) => {
        setlist(res.data);
        setOriginalList(res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const categories = [
    { value: "", label: "הצג הכל" },
    { value: "Dairy", label: "Dairy" },
    { value: "Bakery", label: "Bakery" },
    { value: "Fruits and Vegetables", label: "Fruits and Vegetables" },
    { value: "Cleaning", label: "Cleaning" },
  ];

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "") {
      setlist(originalList);
    } else {
      setlist(originalList.filter((el) => el.Category === category));
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="articles-container">
          <input
            type="text"
            placeholder="חפש מוצר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              margin: "10px 0",
              width: "200px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              padding: "8px",
              margin: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "white",
            }}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <ExportReport list={list} />
          <TableComponent data={list} />
        </div>
      </div>
    </div>
  );
}

export default Inventory;
