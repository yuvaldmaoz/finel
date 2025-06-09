const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// router.get("/", (req, res) => {
//   const query = `
//     SELECT
//       o.id,
//       DATE_FORMAT(o.created_at, '%d/%m/%Y') AS created_at,
//       s.name AS supplier_name
//     FROM orders o
//     JOIN suppliers s ON o.supplier_id = s.id
//   `;
//   db.query(query, (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//       return;
//     }
//     res.json(results);
//   });
// });

// Example usage:
// GET /orders/by-supplier?supplier=tnuva&startDate=2025-06-06&endDate=2025-06-08
// GET /orders/by-supplier - Returns all orders
router.get("/by-supplier", (req, res) => {
  const supplierName = req.query.supplier || "";
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";

  const query = `
    SELECT 
      o.id,
      DATE_FORMAT(o.created_at, '%d/%m/%Y') AS created_at,
      s.name AS supplier_name
    FROM orders o
    JOIN suppliers s ON o.supplier_id = s.id
    WHERE (s.name = ? OR ? = '')
    AND (
      CASE 
        WHEN ? = '' OR ? = '' THEN 1
        ELSE o.created_at BETWEEN ? AND ?
      END
    )
  `;

  db.query(
    query,
    [supplierName, supplierName, startDate, endDate, startDate, endDate],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});

// Create a new order
// This endpoint creates a new order and updates the stock of products

router.post("/", (req, res) => {
  const { user_id, items, supplier_id } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0 || !supplier_id) {
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

      // כאן הוספנו supplier_id בשאילתת ההכנסה להזמנה
      const orderQuery =
        "INSERT INTO orders (user_id, supplier_id) VALUES (?, ?)";
      db.query(orderQuery, [user_id, supplier_id], (err, result) => {
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

          // כאן יש את עדכון המלאי - שים לב שכרגע הוא מוסיף למלאי (יכול להיות שצריך להפחית)
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







//לקוח 
// router.post("/", (req, res) => {
//   const { user_id, items, supplier_id } = req.body;

//   if (!user_id || !Array.isArray(items) || items.length === 0 || !supplier_id) {
//     return res.status(400).json({ error: "Invalid request payload" });
//   }

//   db.beginTransaction((err) => {
//     if (err) return res.status(500).json({ error: "Transaction error" });

//     const orderQuery =
//       "INSERT INTO orders (user_id, supplier_id) VALUES (?, ?)";
//     db.query(orderQuery, [user_id, supplier_id], (err, result) => {
//       if (err) {
//         db.rollback(() =>
//           res.status(500).json({ error: "Order creation failed" })
//         );
//         return;
//       }

//       const orderId = result.insertId;
//       const orderItems = items.map((item) => [
//         orderId,
//         item.product_id,
//         item.quantity,
//       ]);

//       const itemsQuery = `
//         INSERT INTO order_items (order_id, product_id, quantity)
//         VALUES ?
//       `;

//       db.query(itemsQuery, [orderItems], (err) => {
//         if (err) {
//           db.rollback(() =>
//             res.status(500).json({ error: "Order items creation failed" })
//           );
//           return;
//         }

//         // הורדת מלאי בלבד בלי בדיקות – אתה אחראי לבדוק ב-FE
//         const stockUpdatePromises = items.map((item) => {
//           return new Promise((resolve, reject) => {
//             const updateStockQuery = `
//               UPDATE products
//               SET Quantity = Quantity - ?
//               WHERE id = ?
//             `;
//             db.query(
//               updateStockQuery,
//               [item.quantity, item.product_id],
//               (err, result) => {
//                 if (err) reject(err);
//                 else resolve();
//               }
//             );
//           });
//         });

//         Promise.all(stockUpdatePromises)
//           .then(() => {
//             db.commit((err) => {
//               if (err) {
//                 db.rollback(() =>
//                   res.status(500).json({ error: "Transaction commit failed" })
//                 );
//                 return;
//               }

//               res.status(201).json({
//                 message: "Order created and stock updated",
//                 orderId,
//               });
//             });
//           })
//           .catch((err) => {
//             db.rollback(() =>
//               res.status(500).json({ error: "Stock update failed" })
//             );
//           });
//       });
//     });
//   });
// });

router.get("/details/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `
  SELECT 
    p.id,
    s.name AS Supplier_Name,
    c.name AS Category,
    p.Product_Name,
    p.Price,
    oi.quantity AS Quantity,
    DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
  FROM products p
  JOIN suppliers s ON p.supplier_id = s.id
  JOIN categories c ON p.category_id = c.id
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

router.get("/supplier/:name", (req, res) => {
  const supplierName = req.params.name;
  const query = "SELECT id FROM `suppliers` WHERE name = ?";

  db.query(query, [supplierName], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Supplier not found" });
      return;
    }
    res.json(results[0]);
  });
});

module.exports = router;
