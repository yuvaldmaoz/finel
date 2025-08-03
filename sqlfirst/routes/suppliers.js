const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();




// GET /suppliers - מחזיר את כל הספקים
// This endpoint retrieves all suppliers from the database
router.get("/", (req, res) => {
  const query = `
SELECT name FROM suppliers;
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
