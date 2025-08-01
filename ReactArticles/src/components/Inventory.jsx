import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import ExportReport from "../external_comonets/ExportReport/ExportReport";
import classes from "../external_comonets/window/window.module.css"; // משתמש ב-css של ההזמנות

function Inventory({ userRole }) {
  const [list, setlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [categories, setCategories] = useState([
    { value: "", label: "בחר קטגוריה" },
  ]);

  useEffect(() => {
    fetchFilteredData();
  }, [searchTerm, selectedCategory, selectedSupplier]);

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
  }, []);

  const fetchFilteredData = () => {
    axios
      .get(
        `products/search?name=${searchTerm}&category=${selectedCategory}&supplier=${selectedSupplier}`
      )
      .then((res) => {
        setlist(res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchSuppliers = () => {
    axios
      .get("suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  const fetchCategories = () => {
    axios
      .get("categories")
      .then((res) => {
        const formattedCategories = res.data.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
        setCategories([
          { value: "", label: "בחר קטגוריה" },
          ...formattedCategories,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>
          {userRole === "client" ? "המלאי שלי" : "ניהול מלאי"}
        </h1>
        <div className={classes.filterSection}>
          <input
            type="text"
            placeholder="חפש מוצר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.filterInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={classes.filterInput}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className={classes.filterInput}
          >
            <option value="">בחר ספק</option>
            {suppliers.map((supplier) => (
              <option key={supplier.name} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
          <ExportReport list={list} />
        </div>
      </div>

      <div className="container">
        <TableComponent data={list} />
      </div>
    </div>
  );
}

export default Inventory;
