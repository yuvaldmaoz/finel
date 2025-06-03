import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import Product from "../external_comonets/product/product";

export default function Order() {
  const [productList, setProductList] = useState([]); // מוצרים מהשרת
  const [orderList, setOrderList] = useState([]); // מוצרים שנבחרו להזמנה

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("products")
      .then((res) => {
        setProductList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const submitOrder = () => {
    if (orderList.length === 0) {
      alert("לא נוספו מוצרים להזמנה.");
      return;
    }

    // קיבוץ המוצרים לפי ספק
    const ordersBySupplier = {};
    orderList.forEach((item) => {
      const supplierName = item.Supplier_Name;
      if (!ordersBySupplier[supplierName]) {
        ordersBySupplier[supplierName] = [];
      }
      ordersBySupplier[supplierName].push({
        product_id: item.id,
        quantity: item.Quantity,
      });
    });

    // שליחת הזמנה נפרדת לכל ספק
    let successCount = 0;
    const totalOrders = Object.keys(ordersBySupplier).length;

    Object.entries(ordersBySupplier).forEach(([supplierName, items]) => {
      const orderData = {
        user_id: 1,
        items: items,
      };

      axios
        .post("orders", orderData)
        .then(() => {
          successCount++;
          if (successCount === totalOrders) {
            alert("כל ההזמנות נשלחו בהצלחה!");
            setOrderList([]);
          }
        })
        .catch((error) => {
          console.error(`שגיאה בשליחת הזמנה לספק ${supplierName}:`, error);
          alert(`שגיאה בשליחת הזמנה לספק ${supplierName}`);
        });
    });
  };

  function filterorder() {
    const originalList = [...productList]; // Assuming originalList is the initial productList
    // Removed unused variable 'text'
    setProductList(originalList.filter((el) => el.Quantity < 5));
  }
  function filterbaek() {
    fetchData(); // Reset the productList to its original state by fetching data again
  }

  return (
    <div style={{ padding: "20px" }}>
      <TableComponent data={orderList} />
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button onClick={submitOrder} className="btn">
          בצע הזמנה
        </button>
        <button onClick={filterorder} className="btn">
          צריך להזמין
        </button>
        <button onClick={filterbaek} className="btn">
          הצג הכול
        </button>
      </div>

      <div className="products-grid">
        {productList.map((product) => (
          <Product key={product.id} user={product} setList={setOrderList} />
        ))}
      </div>
    </div>
  );
}
