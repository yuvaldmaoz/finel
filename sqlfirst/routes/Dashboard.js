const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/candles", (req, res) => {
  const query = `
SELECT 
  MONTH(created_at) AS month,
  COUNT(*) AS total_objects
FROM orders
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY YEAR(created_at), MONTH(created_at);
`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

router.get("/cake", (req, res) => {
  const query = `
SELECT 
  users.name,
  COUNT(task.title) AS task_count
FROM 
  users
LEFT JOIN 
  task ON users.id = task.user_id
GROUP BY 
  users.name;
`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

router.get("/card", (req, res) => {
  const query = `
SELECT 'orders' AS tables, COUNT(*) AS total_objects FROM orders
UNION ALL
SELECT 'task', COUNT(*) FROM task
UNION ALL
SELECT 'users', COUNT(*) FROM users;
`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});




router.get("/critical", (req, res) => {
  const query = `
SELECT 
    id,
    Supplier_Name,
    Category,
    Product_Name,
    Price,
    Quantity,
    DATE_FORMAT(Expiration_Date, '%d/%m/%Y') AS Expiration_Date
FROM products
WHERE Quantity < 5
   OR DATEDIFF(Expiration_Date, CURDATE()) <= 5
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
