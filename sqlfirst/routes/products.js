const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();
/**
 * מחזיר את כל המוצרים עם אפשרות לחיפוש לפי שם, קטגוריה וספק
 * דוגמת בקשת GET:
 * /products/search?name=productName&category=categoryName&supplier=supplierName
 * המערך המוחזר:
 * [
 *  {
 *   "id": 1,
 *  "supplier_id": 2,
 *  "Supplier_Name": "Supplier A",
 * "Category": "Category X",
 * "Product_Name": "Product 1",
 * "Price": 100.00,
 * "Quantity": 10,
 * "Expiration_Date": "31/12/2025"
 *  },
 * ...
 * ]
 * לא חייב למלא את כול ה הפרמטרים, אפשר להשאיר ריקים
 * אם לא ממלאים כלום, מחזיר את כל המוצרים
 * כמו אצל ממשק המשתמש
 */

router.get("/search", (req, res) => {
  const name = req.query.name || "";
  const category = req.query.category || "";
  const supplier = req.query.supplier || "";

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
WHERE 
  (p.Product_Name LIKE ? OR ? = '')
  AND
  (c.name = ? OR ? = '')
  AND
  (s.name = ? OR ? = '')
  `;

  const searchTerm = `%${name}%`;
  db.query(
    query,
    [searchTerm, name, category, category, supplier, supplier],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    }
  );
});

module.exports = router;
