const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// GET /orders/by-supplier - מחזיר את ההזמנות לפי ספק, תאריכים וסטטוס (אם נמסרו בפרמטרים)
//דוגמא מערך מוחזר:
// [  
//   {
//     "id": 1,
//     "created_at": "01/01/2023",
//     "supplier_name": "Supplier A",
//     "status": "open"
//   }, 
// ]   
router.get("/by-supplier", (req, res) => {
  const supplierName = req.query.supplier || "";
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";
  const status = req.query.status || "";

  const query = `
    SELECT 
      o.id,
      DATE_FORMAT(o.created_at, '%d/%m/%Y') AS created_at,
      s.name AS supplier_name,
      o.status
    FROM orders o
    JOIN suppliers s ON o.supplier_id = s.id
    WHERE (s.name = ? OR ? = '')
      AND (
        CASE 
          WHEN ? = '' OR ? = '' THEN 1
          ELSE o.created_at BETWEEN ? AND ? 
        END
      )
      AND (o.status = ? OR ? = '')
  `;

  db.query(
    query,
    [
      supplierName,
      supplierName,
      startDate,
      endDate,
      startDate,
      endDate,
      status,
      status,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});

// POST /orders - יצירת הזמנה חדשה עם פריטים; המלאי יתעדכן רק בסגירת ההזמנה
// דוגמת בקשת POST:
// {
//   "user_id": 5,
//   "items": [
//     {
//       "product_id": 10,
//       "quantity": 2
//     },
//     {
//       "product_id": 20,
//       "quantity": 1
//     }
//   ],
//   "supplier_id": 3
// }
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

      // יצירת הזמנה עם status = 'open'
      const orderQuery = `
        INSERT INTO orders (user_id, supplier_id, status)
        VALUES (?, ?, 'open')
      `;

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

          db.commit((err) => {
            if (err) {
              db.rollback(() =>
                res.status(500).json({ error: "Transaction commit failed" })
              );
              return;
            }

            res.status(201).json({
              message:
                "Order created successfully (status: open). Stock will be updated on close.",
              orderId,
            });
          });
        });
      });
    });
  });
});


// POST /orders/:orderId/close - סגירת הזמנה ועדכון המלאי ועדכון תאריך תפוגה שבוע קדימה
// דוגמת בקשת POST:
// {
//   "orderId": 1
// }
router.post("/:orderId/close", (req, res) => {
  const orderId = req.params.orderId;

  // שלב 1: בדיקה אם ההזמנה קיימת ופתוחה
  db.query(
    "SELECT * FROM orders WHERE id = ? AND status = 'open'",
    [orderId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (results.length === 0) {
        return res
          .status(400)
          .json({ error: "Order not found or already closed" });
      }

      // שלב 2: קבלת פריטי ההזמנה
      db.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [orderId],
        (err, items) => {
          if (err)
            return res.status(500).json({ error: "Failed to get order items" });

          if (items.length === 0)
            return res
              .status(400)
              .json({ error: "No items found for this order" });

          // שלב 3: חישוב תאריך תפוגה שבוע קדימה
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          const mysqlFormattedDate = expirationDate.toISOString().split("T")[0]; // YYYY-MM-DD

          // בניית הערכים לעדכון
          const values = items.map((item) => [
            item.product_id,
            item.quantity,
            mysqlFormattedDate,
          ]);

          const updateStockQuery = `
            INSERT INTO products (id, Quantity, Expiration_Date)
            VALUES ?
            ON DUPLICATE KEY UPDATE 
              Quantity = Quantity + VALUES(Quantity),
              Expiration_Date = VALUES(Expiration_Date);
          `;

          db.query(updateStockQuery, [values], (err) => {
            if (err)
              return res.status(500).json({ error: "Stock update failed" });

            // שלב 4: עדכון סטטוס להזמנה ל־closed
            db.query(
              "UPDATE orders SET status = 'closed' WHERE id = ?",
              [orderId],
              (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ error: "Failed to update order status" });

                res.json({ message: "Order closed and stock updated" });
              }
            );
          });
        }
      );
    }
  );
});

// GET /orders/details/:id - מחזיר פרטי פריטים בהזמנה לפי מזהה ההזמנה
//דוגמא למערך המוחזר:
// [
//   {
//     "id": 1,
//     "supplier_name": "Supplier A",
//     "category": "Category A",
//     "Product_Name": "Product A",
//     "Price": 100.00,
//     "Quantity": 2,
//     "Expiration_Date": "01/01/2025"
//   }
// ]
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

// GET /orders/supplier/:name - מחזיר את מזהה הספק לפי שמו
//המערך המוחזר:
// [
//   {
//     "id": 1
//   }
// ]
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
