const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

/**
 * יצירת הזמנה חדשה ללקוח ועדכון מלאי המוצרים
  * דוגמת בקשת POST:
{
  "user_id": 5,
  "items": [
    {
      "product_id": 12,
      "quantity": 3
    },
    {
      "product_id": 7,
      "quantity": 1
    }
  ]
} */

router.post("/", (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction error" });

    const orderQuery = "INSERT INTO orders_client (user_id) VALUES (?)";
    db.query(orderQuery, [user_id], (err, result) => {
      if (err) {
        db.rollback(() =>
          res.status(500).json({ error: "Order creation failed" })
        );
        return;
      }


      // יצירת רשומות פריטי ההזמנה
      const orderId = result.insertId;
      const orderItems = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
      ]);

      const itemsQuery = `
        INSERT INTO order_items_client (order_id, product_id, quantity)
        VALUES ?
      `;

      db.query(itemsQuery, [orderItems], (err) => {
        if (err) {
          db.rollback(() =>
            res.status(500).json({ error: "Order items creation failed" })
          );
          return;
        }

        const stockUpdatePromises = items.map((item) => {
          return new Promise((resolve, reject) => {
            const updateStockQuery = `
              UPDATE products
              SET Quantity = Quantity - ?
              WHERE id = ?
            `;
            db.query(
              updateStockQuery,
              [item.quantity, item.product_id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        Promise.all(stockUpdatePromises)
          .then(() => {
            db.commit((err) => {
              if (err) {
                db.rollback(() =>
                  res.status(500).json({ error: "Transaction commit failed" })
                );
                return;
              }

              res.status(201).json({
                message: "Client order created and stock updated",
                orderId,
              });
            });
          })
          .catch(() => {
            db.rollback(() =>
              res.status(500).json({ error: "Stock update failed" })
            );
          });
      });
    });
  });
});




/**
 * שליפת כל ההזמנות של לקוח לפי מזהה ותאריכים
 * דוגמת בקשת GET:
 * /client?user_id=5&startDate=2023-01-01&endDate=2023-12-31
 * הערך המוחזר הוא מערך של הזמנות, כולל מזהה ההזמנה ותאריך יצירתה
 * [
  {
    "id": 101,
    "created_at": "05/08/2025",
    "user_id": 5
  },
  {
    "id": 102,
    "created_at": "10/08/2025",
    "user_id": 5
  }
]
 */
router.get("/", (req, res) => {
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";
  const user_id = req.query.user_id;

  const query = `
    SELECT 
      id,
      DATE_FORMAT(o.created_at, '%d/%m/%Y') AS created_at,
      user_id
    FROM orders_client o
    WHERE o.user_id = ?
      AND (
        (? = '' OR ? = '') 
        OR (o.created_at BETWEEN ? AND ?)
      )
  `;

  db.query(
    query,
    [user_id, startDate, endDate, startDate, endDate],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});

/**
 * שליפת פרטי הזמנה לפי מזהה הזמנה
 * דוגמת בקשת GET:
 * /client/9
 * הערך המוחזר הוא מערך של פריטים בהזמנה, כולל פרטי המוצר, הספק והקטגוריה
 * [
  {
    "id": 1,
    "Supplier_Name": "Supplier A",
    "Category": "Category X",
    "Product_Name": "Product 1",
    "Price": 100.00,
    "Quantity": 2,
    "Expiration_Date": "31/12/2025"
  },
  {
    "id": 2,
    "Supplier_Name": "Supplier B",
    "Category": "Category Y",
    "Product_Name": "Product 2",
    "Price": 50.00,
    "Quantity": 1,
    "Expiration_Date": "30/11/2025"
  }
 */
router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `
SELECT 
  p.id,
  s.name AS Supplier_Name,
  c.name AS Category,
  p.Product_Name,
  p.Price,
  oic.quantity AS Quantity,
  DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
JOIN categories c ON p.category_id = c.id
JOIN order_items_client oic ON oic.product_id = p.id
WHERE oic.order_id = ?;
`;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

module.exports = router;
