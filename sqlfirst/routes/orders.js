const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query =
    "SELECT id, DATE_FORMAT(created_at, '%d/%m/%Y') AS created_at FROM `orders`";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Create a new order
// This endpoint creates a new order and updates the stock of products

router.post("/", (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const productIds = items.map((item) => item.product_id);
  const checkProductsQuery = "SELECT id FROM products WHERE id IN (?)";

  db.query(checkProductsQuery, [productIds], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check products" });
    }

    const existingProductIds = result.map((product) => product.id);
    const invalidProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id)
    );

    if (invalidProductIds.length > 0) {
      return res.status(400).json({
        error: `Invalid product IDs: ${invalidProductIds.join(", ")}`,
      });
    }

    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: "Transaction error" });

      const orderQuery = "INSERT INTO orders (user_id) VALUES (?)";
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
          INSERT INTO order_items (order_id, product_id, quantity)
          VALUES ?
        `;

        db.query(itemsQuery, [orderItems], (err) => {
          if (err) {
            db.rollback(() =>
              res.status(500).json({ error: "Order items creation failed" })
            );
            return;
          }

          const stockUpdateValues = items.map((item) => [
            item.product_id,
            item.quantity,
          ]);

          const updateStockQuery = `
            INSERT INTO products (id, Quantity)
            VALUES ?
            ON DUPLICATE KEY UPDATE Quantity = VALUES(Quantity) + products.Quantity;
          `;

          db.query(updateStockQuery, [stockUpdateValues], (err) => {
            if (err) {
              db.rollback(() =>
                res.status(500).json({ error: "Stock update failed" })
              );
              return;
            }

            db.commit((err) => {
              if (err) {
                db.rollback(() =>
                  res.status(500).json({ error: "Transaction commit failed" })
                );
                return;
              }

              res.status(201).json({
                message: "Order created successfully, stock updated",
                orderId,
              });
            });
          });
        });
      });
    });
  });
});

router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `
    SELECT 
      p.id,
      s.name AS Supplier_Name,
      p.Category,
      p.Product_Name,
      p.Price,
      p.Quantity,
      DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.id
    JOIN order_items oi ON oi.product_id = p.id
    WHERE oi.order_id = ?;
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
