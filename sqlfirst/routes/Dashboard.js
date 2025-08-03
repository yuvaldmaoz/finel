const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// הפונקציה מחזירה נתונים עבור גרף עמודות (candles) של הזמנות חנות והזמנות לקוח לפי חודשים
router.get("/candles", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing 'from' or 'to' parameters" });
  }

  const fromDate = `${from}-01`; // YYYY-MM-01
  const toDate = `${to}-31`; // YYYY-MM-31 (פשוט לסיום החודש)

  const query = `
    SELECT 
      MONTH(o.created_at) AS month,
      COUNT(o.id) AS store_orders,
      (
        SELECT COUNT(*) 
        FROM orders_client oc 
        WHERE 
          MONTH(oc.created_at) = MONTH(o.created_at)
          AND oc.created_at BETWEEN ? AND ?
      ) AS client_orders
    FROM orders o
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY MONTH(o.created_at)
    ORDER BY MONTH(o.created_at);
  `;

  db.query(query, [fromDate, toDate, fromDate, toDate], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// הפונקציה מחזירה נתונים עבור גרף עוגה (cake) של מספר משימות לכל עובד בטווח תאריכים
router.get("/cake", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing 'from' or 'to' parameters" });
  }

  const query = `
    SELECT 
      users.name,
      COUNT(task.title) AS task_count
    FROM 
      users
    LEFT JOIN 
      task ON users.id = task.user_id 
             AND task.date BETWEEN ? AND ?
    GROUP BY 
      users.name;
  `;

  db.query(query, [from, to], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// הפונקציה מחזירה סיכום של מספר אובייקטים עיקריים במערכת (הזמנות, משימות, עובדים, לקוחות)
router.get("/card", (req, res) => {
  const query = `
SELECT 'orders' AS tables, COUNT(*) AS total_objects FROM orders
UNION ALL
SELECT 'task', COUNT(*) FROM task
UNION ALL
SELECT 'employ', COUNT(*) FROM users WHERE role = "employe" OR role = "admin"
UNION ALL
SELECT 'client', COUNT(*) FROM users WHERE role = "client";
`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// הפונקציה מחזירה מוצרים קריטיים לפי כמות נמוכה או תוקף פג תוקף
router.get("/critical", (req, res) => {
  const { filter } = req.query;

  let whereClause = "";
  if (filter === "Quantity") {
    whereClause = "p.Quantity < 5";
  } else if (filter === "Expiration_Date") {
    whereClause = "DATEDIFF(p.Expiration_Date, CURDATE()) <= 5";
  } else {
    // ברירת מחדל: מציג את כל הקריטיים (שני התנאים)
    whereClause =
      "p.Quantity < 5 OR DATEDIFF(p.Expiration_Date, CURDATE()) <= 5";
  }

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
    WHERE ${whereClause};
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
