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




// GET /returns/by-supplier - מחזיר את ההחזרות לפי ספק, תאריכים וסטטוס (אם נמסרו בפרמטרים)
// דוגמא מערך מוחזר:
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
      r.id,
      DATE_FORMAT(r.created_at, '%d/%m/%Y') AS created_at,
      s.name AS supplier_name,
      r.status
    FROM returns r
    JOIN suppliers s ON r.supplier_id = s.id
    WHERE (s.name = ? OR ? = '')
      AND (
        CASE 
          WHEN ? = '' OR ? = '' THEN 1
          ELSE r.created_at BETWEEN ? AND ? 
        END
      )
      AND (r.status = ? OR ? = '')
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

// POST /returns - יצירת החזרה חדשה עם פריטים
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

      // יצירת החזרה עם סטטוס 'open'
      const returnQuery = `
        INSERT INTO returns (user_id, supplier_id, status)
        VALUES (?, ?, 'open')
      `;

      db.query(returnQuery, [user_id, supplier_id], (err, result) => {
        if (err) {
          db.rollback(() =>
            res.status(500).json({ error: "Return creation failed" })
          );
          return;
        }

        const returnId = result.insertId;
        const returnItems = items.map((item) => [
          returnId,
          item.product_id,
          item.quantity,
        ]);

        const itemsQuery = `
          INSERT INTO return_items (return_id, product_id, quantity)
          VALUES ?
        `;

        db.query(itemsQuery, [returnItems], (err) => {
          if (err) {
            db.rollback(() =>
              res.status(500).json({ error: "Return items creation failed" })
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
              message: "Return created successfully (status: open).",
              returnId,
            });
          });
        });
      });
    });
  });
});

// POST /returns/:returnId/close - סגירת החזרה ועדכון מלאי
// דוגמת בקשת POST:
// {
//   "returnId": 1
// }
router.post("/:returnId/close", (req, res) => {
  const returnId = req.params.returnId;

  // שלב 1: בדיקה אם ההחזרה קיימת ופתוחה
  db.query(
    "SELECT * FROM returns WHERE id = ? AND status = 'open'",
    [returnId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (results.length === 0) {
        return res
          .status(400)
          .json({ error: "Return not found or already closed" });
      }

      // שלב 2: קבלת פריטי ההחזרה
      db.query(
        "SELECT product_id, quantity FROM return_items WHERE return_id = ?",
        [returnId],
        (err, items) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Failed to get return items" });

          if (items.length === 0)
            return res
              .status(400)
              .json({ error: "No items found for this return" });

          // שלב 3: הפחתת הכמות מהמלאי ואיפוס תאריך תפוגה אם הכמות = 0
          const promises = items.map(
            (item) =>
              new Promise((resolve, reject) => {
                const query = `
                  UPDATE products
                  SET Quantity = GREATEST(Quantity - ?, 0),
                      Expiration_Date = CASE WHEN GREATEST(Quantity - ?, 0) = 0 THEN NULL ELSE Expiration_Date END
                  WHERE id = ?
                `;
                db.query(
                  query,
                  [item.quantity, item.quantity, item.product_id],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              })
          );

          Promise.all(promises)
            .then(() => {
              // שלב 4: עדכון סטטוס ההחזרה ל־closed
              db.query(
                "UPDATE returns SET status = 'closed' WHERE id = ?",
                [returnId],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ error: "Failed to update return status" });

                  res.json({
                    message:
                      "Return closed, stock updated and expiration dates reset if needed",
                  });
                }
              );
            })
            .catch(() => {
              res.status(500).json({ error: "Stock update failed" });
            });
        }
      );
    }
  );
});


// GET /returns/details/:id - מחזיר פרטי פריטים בהחזרה לפי מזהה ההחזרה
// דוגמא מערך מוחזר:
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
  const returnId = req.params.id;
  const query = `
  SELECT 
    p.id,
    s.name AS Supplier_Name,
    c.name AS Category,
    p.Product_Name,
    p.Price,
    ri.quantity AS Quantity,
    DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
  FROM products p
  JOIN suppliers s ON p.supplier_id = s.id
  JOIN categories c ON p.category_id = c.id
  JOIN return_items ri ON ri.product_id = p.id
  WHERE ri.return_id = ?;
`;

  db.query(query, [returnId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

module.exports = router;











module.exports = router;
