const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();



// GET /tasks - מחזיר את כל המשימות
// This endpoint retrieves all tasks from the database
// Example response:
// [
//   {
//     "id": 1,
//     "title": "Task 1",
//     "status": "pending",
//     "user_id": 1,
//     "date": "2023-10-01"
//   },
router.get("/", (req, res) => {
  const query = `
    SELECT 
      task.id, 
      task.title, 
      task.status,
      users.name, 
      DATE_FORMAT(task.date, '%d/%m/%Y') AS date 
    FROM task
    JOIN users ON task.user_id = users.id;
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});



// GET /tasks/:id - מחזיר משימה לפי מזהה
// דוגמא למערך מוחזר:
// [
//   {
//     "id": 1,
//     "title": "Task 1",
//     "status": "pending",
//     "user_id": 1,
//     "date": "2023-10-01"
//   }
// ]
router.post("/:id", (req, res) => {
  const { id } = req.params;
  const query = `
  UPDATE task
  SET status = 'completed'
  WHERE id = ?;
`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "tatus = 'completed'! " });
  });
});





// POST /tasks - יצירת משימה חדשה
// דוגמת בקשת POST:
// {
//   "title": "New Task",
//   "status": "pending",
//   "user_id": 1,
//   "date": "2023-10-01"
// }
router.post("/", (req, res) => {
  const { title, status, user_id, date } = req.body;
  const query = `
INSERT INTO task (title, status, user_id, date)
VALUES (?, ?, ?, ?);
`;
  db.query(query, [title, status, user_id, date], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "Task added successfully!" });
  });
});

module.exports = router;
