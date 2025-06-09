import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import ExportReport from "../external_comonets/ExportReport/ExportReport";

function Inventory() {
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{
              padding: "8px",
              margin: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "white",
            }}
          >
            <option value="">בחר ספק</option>
            {suppliers.map((supplier) => (
              <option key={supplier.name} value={supplier.name}>
                {supplier.name}
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
