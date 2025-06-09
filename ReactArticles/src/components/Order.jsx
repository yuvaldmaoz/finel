import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../external_comonets/table/table";
import Product from "../external_comonets/product/product";

export default function Order() {
  const [productList, setProductList] = useState([]); // מוצרים מהשרת
  const [orderList, setOrderList] = useState([]); // מוצרים שנבחרו להזמנה
  const [searchTerm, setSearchTerm] = useState(""); // מונח חיפוש
  const [selectedCategory, setSelectedCategory] = useState(""); // קטגוריה מסוננת
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [categories, setCategories] = useState([{ value: "", label: "בחר קטגוריה" }]);

  useEffect(() => {
    fetchData();
    fetchSuppliers();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedSupplier]);

  const fetchData = () => {
    axios
      .get(
        `products/search?name=${searchTerm}&category=${selectedCategory}&supplier=${selectedSupplier}`
      )
      .then((res) => {
        setProductList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
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
        setCategories([{ value: "", label: "בחר קטגוריה" }, ...formattedCategories]);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
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
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="חפש מוצר..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "8px",
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
      </div>

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
