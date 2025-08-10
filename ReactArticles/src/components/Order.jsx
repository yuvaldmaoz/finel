import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import Product from "../external_comonets/product/product";
import classes from "../external_comonets/window/window.module.css";

export default function Order({ userRole, id }) {
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [categories, setCategories] = useState([
    { value: "", label: "בחר קטגוריה" },
  ]);

  // רכיבוי התנהגות ברירת מחדל של React כדי למנוע רינדור כפול
  useEffect(() => {
    fetchData();
    fetchSuppliers();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedSupplier]);

  const fetchData = () => {
    axios
    //רשימת המוצרים לאחר סינון לפי חיפוש, קטגוריה וספק
      .get(
        `products/search?name=${searchTerm}&category=${selectedCategory}&supplier=${selectedSupplier}`
      )
      .then((res) => setProductList(res.data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchSuppliers = () => {
    axios
      //רשימת הספקים
      .get("suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((error) => console.error("Error fetching suppliers:", error));
  };

  const fetchCategories = () => {
    axios
      //רשימת הקטגוריות 
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

  //שליחת ההזמנה
  const submitOrder = () => {
    if (orderList.length === 0) {
      alert("לא נוספו מוצרים להזמנה.");
      return;
    }

    // אם המשתמש הוא לקוח, נשלח את ההזמנה כבקשת POST
    if (userRole === "client") {
      const orderData = {
        user_id: id,
        items: orderList.map((item) => ({
          product_id: item.id,
          quantity: item.Quantity,
        })),
      };
      axios
        //שליחת ההזמנה לשרת
        //דוגמא בקשת POST:
        // {
        //   "user_id": 5,
        //   "items": [
        //     {
        //       "product_id": 12,
        //       "quantity": 3
        //     },
        //     {
        //       "product_id": 7,
        //       "quantity": 1
        //     }
        //   ]
        // }
        .post("client", orderData)
        .then(() => {
          alert("ההזמנה בוצעה בהצלחה!");
          setOrderList([]);
          fetchData();
        })
        .catch((error) => {
          console.error("שגיאה בשליחת ההזמנה:", error);
          alert("שגיאה בשליחת ההזמנה");
        });

      // אם המשתמש הוא מנהל, נשלח את ההזמנה לספקים
      // שליחת הזמנות לכל ספק בנפרד
      // דוגמא בקשת POST:
      // {
      //   "user_id": 1,
      //   "supplier_id": 3,
      //   "items": [
      //     {
      //       "product_id": 10,
      //       "quantity": 2
      //     },
      //     {
      //       "product_id": 20,
      //       "quantity": 1
      //     }
      //   ]
      // }
      // כל הזמנה תישלח לספק המתאים
    } else {
      const ordersBySupplier = {};
      orderList.forEach((item) => {
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
            return axios.post("orders", orderData);
          })
          .then(() => {
            alert(`הזמנה לספק ${supplierName} בוצעה בהצלחה!`);
            if (Object.keys(ordersBySupplier).length === 1) {
              setOrderList([]);
              fetchData();
            }
          })
          .catch((error) => {
            console.error(`שגיאה בשליחת ההזמנה לספק ${supplierName}:`, error);
            alert(`שגיאה בשליחת ההזמנה לספק ${supplierName}`);
          });
      });
    }
  };

  const filterorder = () => {
    const originalList = [...productList];
    setProductList(originalList.filter((el) => el.Quantity < 5));
  };

  const filterbaek = () => {
    fetchData();
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.header} ${classes.headerReverse}`}>
        <h1 className={classes.title}>הוסף הזמנה</h1>
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
          {userRole === "admin" && (
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
          )}
        </div>
      </div>
      {orderList.length === 0 && (
        <div className={classes.emptyMessage}>
          אין מוצרים בהזמנה. אנא הוסף מוצרים להזמנה
        </div>
      )}
      {orderList.length > 0 && (
        <>
          <TableComponent data={orderList} role={userRole} />

          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button onClick={submitOrder} className={classes.button}>
              {userRole === "client" ? "שלח הזמנה" : "בצע הזמנה מספקים"}
            </button>
            {userRole === "admin" && (
              <>
                <button onClick={filterorder} className={classes.button}>
                  צריך להזמין
                </button>
                <button onClick={filterbaek} className={classes.button}>
                  הצג הכול
                </button>
              </>
            )}
          </div>
        </>
      )}

      <div className="products-grid">
        {productList.map((product) => (
          <Product key={product.id} user={product} setList={setOrderList} />
        ))}
      </div>
    </div>
  );
}
