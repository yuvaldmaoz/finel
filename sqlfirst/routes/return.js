const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// GET /return/ - מחזיר רשימת מוצרים קריטיים עם תאריך תפוגה קרוב
// דוגמת תשובה:
// [
//   {
//     "id": 1,
//     "supplier_id": 2,
//     "Supplier_Name": "Supplier A",
//     "Category": "Category A",
//     "Product_Name": "Product A",
//     "Price": 100,
//     "Quantity": 3,
//     "Expiration_Date": "2023-12-31"
//   },
//   ...
// ]
router.get("/", (req, res) => {
  const query = `
    SELECT 
      p.id,
      s.id AS supplier_id,
      s.name AS Supplier_Name,
      c.name AS Category,
      p.Product_Name,
      p.Price,
      p.Quantity,
      DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.id
    JOIN categories c ON p.category_id = c.id
    WHERE DATEDIFF(p.Expiration_Date, CURDATE()) <= 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});


module.exports = router;
