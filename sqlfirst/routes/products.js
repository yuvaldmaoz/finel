const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query = `
    SELECT 
      p.id,
      s.id AS supplier_id,
      s.name AS Supplier_Name,
      p.Category,
      p.Product_Name,
      p.Price,
      p.Quantity,
      DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// router.get("/search/:name?", (req, res) => {
//   const name = req.params.name || "";
//   const query = `
//     SELECT 
//       p.id,
//       s.id AS supplier_id,
//       s.name AS Supplier_Name,
//       p.Category,
//       p.Product_Name,
//       p.Price,
//       p.Quantity,
//       DATE_FORMAT(p.Expiration_Date, '%d/%m/%Y') AS Expiration_Date
//     FROM products p
//     JOIN suppliers s ON p.supplier_id = s.id
//     WHERE p.Product_Name LIKE ?
//   `;

//   const searchPattern = `%${name}%`;

//   db.query(query, [searchPattern], (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//       return;
//     }
//     res.json(results);
//   });
// });

module.exports = router;
