import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import classes from "../external_comonets/window/window.module.css";

export default function Return() {
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [categories, setCategories] = useState([
    { value: "", label: "בחר קטגוריה" },
  ]);

  useEffect(() => {
    fetchData();
    fetchSuppliers();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedSupplier]);

  const fetchData = () => {
    axios
      .get("return")
      .then((res) => setProductList(res.data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchSuppliers = () => {
    axios
      .get("suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((error) => console.error("Error fetching suppliers:", error));
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
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const submitReturn = () => {
    if (productList.length === 0) {
      alert("לא נוספו מוצרים להחזרה.");
      return;
    }

    const ordersBySupplier = {};
    productList.forEach((item) => {
      const supplierId = item.Supplier_Name;
      if (!ordersBySupplier[supplierId]) ordersBySupplier[supplierId] = [];
      ordersBySupplier[supplierId].push({
        product_id: item.id,
        quantity: item.Quantity,
      });
    });

    Object.keys(ordersBySupplier).forEach((supplierName) => {
      axios
        .get(`orders/supplier/${supplierName}`)
        .then((supplierRes) => {
          const orderData = {
            user_id: 1,
            supplier_id: supplierRes.data.id,
            items: ordersBySupplier[supplierName],
          };
          return axios.post("return", orderData);
        })
        .then(() => {
          alert(`החזרה לספק ${supplierName} בוצעה בהצלחה!`);
          if (Object.keys(ordersBySupplier).length === 1) {
            setOrderList([]);
            fetchData();
          }
        })
        .catch((error) => {
          console.error(`שגיאה בשליחת החזרה לספק ${supplierName}:`, error);
          alert(`שגיאה בשליחת החזרה לספק ${supplierName}`);
        });
    });
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>הוסף החזרה</h1>
      </div>

      {productList.length === 0 && (
        <div className={classes.emptyMessage}>אין מוצרים להחזרה</div>
      )}

      {productList.length > 0 && (
        <>
          <TableComponent data={productList} />

          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button onClick={submitReturn} className={classes.button}>
              בצע החזרה לספקים
            </button>
          </div>
        </>
      )}
    </div>
  );
}
