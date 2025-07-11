const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

router.get("/name", (req, res) => {
  const query = "SELECT id, name FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

router.get("/login", (req, res) => {
  const query = "SELECT id, email, password, role, name FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

const bcrypt = require("bcrypt");

// הוספת משתמש חדש - הצפנת סיסמה לפני השמירה
router.post("/", async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)";
    db.query(query, [email, hashedPassword, role, name], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "User added!", id: results.insertId });
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// התחברות משתמש - משיגים את ההאש מהמסד ומשווים עם bcrypt
router.post("/Login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT id, name, role, password FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Login failed" });
    }

    const user = results[0];

    // השוואה אסינכרונית בין הסיסמה שהתקבלה לסיסמה ההאש שנשמרה במסד
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Login failed" });
    }

    res.json({
      message: "Login successful",
      id: user.id,
      name: user.name,
      role: user.role,
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "User deleted! " });
  });
});

module.exports = router;
