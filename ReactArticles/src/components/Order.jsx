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

    // Group products by supplier
    const ordersBySupplier = {};
    orderList.forEach((item) => {
      const supplierId = item.Supplier_Name;
      if (!ordersBySupplier[supplierId]) {
        ordersBySupplier[supplierId] = [];
      }
      ordersBySupplier[supplierId].push({
        product_id: item.id,
        quantity: item.Quantity,
      });
    });

    // Send separate order for each supplier
    Object.keys(ordersBySupplier).forEach((supplierName) => {
      // First get the supplier ID
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
        .then((res) => {
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
