const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

// הפונקציה מחזירה את כל המשימות של עובד לפי שמו
router.get("/", (req, res) => {
  const { name } = req.query;

  const query = `
    SELECT 
      task.id, 
      task.title, 
      task.status,
      users.name, 
      DATE_FORMAT(task.date, '%d/%m/%Y') AS date 
    FROM task
    JOIN users ON task.user_id = users.id
    WHERE users.name = ?;
  `;
  db.query(query, [name], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// הפונקציה מחזירה את המשמרות של עובד לפי שמו ולפי השבוע האחרון
router.get("/Shift", (req, res) => {
  const { name } = req.query;
  const query = `
SELECT
  users.name AS UserName,
  DATE_FORMAT(Shifts.shift_date, '%d/%m/%Y') AS ShiftDate,
  Shifts.shift_type AS ShiftType,
  DATE_FORMAT(Shifts_Schedule.week_start_date, '%d/%m/%Y') AS WeekStartDate
FROM Shifts
JOIN Shifts_Schedule ON Shifts.schedule_id = Shifts_Schedule.id
JOIN users ON Shifts.user_id = users.id
WHERE users.name = ?
  AND Shifts_Schedule.week_start_date = (
    SELECT MAX(week_start_date) FROM Shifts_Schedule
  );
  `;

  db.query(query, [name], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

module.exports = router;
module.exports = router;
