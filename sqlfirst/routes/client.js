const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// Get all categories

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

// Get all orders for a client
router.get("/", (req, res) => {
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";

  const query = `
    SELECT 
      id,
      DATE_FORMAT(o.created_at, '%d/%m/%Y') AS created_at,
      user_id
    FROM orders_client o
    WHERE (
      (? = '' OR ? = '') 
      OR (o.created_at BETWEEN ? AND ?)
    )
  `;

  db.query(query, [startDate, endDate, startDate, endDate], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Get all orders for a client
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
