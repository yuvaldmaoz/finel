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

router.get("/", (req, res) => {
  const query =
    "SELECT id, DATE_FORMAT(week_start_date, '%d/%m/%Y') AS week_start_date FROM `shifts_schedule`;";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

module.exports = router;
