import React, { useState, useEffect } from "react";
import axios from "axios";
import ShiftsTable from "../external_comonets/shiftsTable/ShiftsTable";

// יצירת מערך של 14 משמרות - 7 ימים כפול 2 משמרות (בוקר וערב)
const shifts = [];
const startDate = new Date(); // תאריך ושעה נוכחיים
for (let i = 0; i < 7; i++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);
  const dateStr = date.toISOString().slice(0, 10); // תאריך בפורמט YYYY-MM-DD
  shifts.push({ date: dateStr, type: "morning" }); // מוסיף משמרת בוקר
  shifts.push({ date: dateStr, type: "evening" }); // מוסיף משמרת ערב
}

export default function AddShift() {
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    fetchNameList();
  }, []);

  const fetchNameList = () => {
    axios
      .get("users/name")
      .then((res) => {
        setNameList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleSave = () => {
    // לוקח את כל תיבות הבחירה מהדום
    const selects = document.querySelectorAll("select");

    // יוצר מערך של אובייקטים שמכילים תאריך, סוג, ו-id העובד שנבחר
    const result = Array.from(selects).map((sel, idx) => ({
      shift_date: shifts[idx].date,
      shift_type: shifts[idx].type,
      user_id: Number(sel.value),
    }));

    // בודק אם כל המשמרות אוישו (כל תיבה נבחרה)
    const allSelected = result.every((r) => r.user_id);
    if (!allSelected) {
      alert("יש לבחור עובד לכל משמרת לפני שמירה.");
      return;
    }

    // מדפיס את התוצאה בפורמט נוח לקריאה
    //alert(JSON.stringify(result, null, 2));

    // הכנת גוף הבקשה בפורמט הנדרש
    const weekStartDateStr = startDate.toISOString().slice(0, 10);
    const ShiftData = {
      week_start_date: weekStartDateStr,
      shifts: result,
    };

    // שליחת הבקשה לשרת
    axios
      .post("Shift/schedules", ShiftData)
      .then((res) => {
        alert("הבוצעה בהצלחה!");
        // ...אם צריך איפוס שדות, הוסף כאן...
      })
      .catch((error) => {
        console.error("שגיאה בשליחת ה:", error);
        alert("שגיאה בביצוע ");
      });
  };

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h2>סידור משמרות</h2>
      <div className="shifts-table-container">
        <table className="shifts-table">
          <thead>
            <tr>
              <th>שם עובד</th>
              <th>תאריך</th>
              <th>סוג משמרת</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, idx) => (
              <tr key={idx}>
                <td>
                  {/* תיבת בחירה עבור כל משמרת */}
                  <select defaultValue="">
                    <option value="">בחר עובד</option>
                    {nameList.map((emp, i) => (
                      <option key={i} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{shift.date}</td>
                <td>{shift.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        {/* כפתור לשמירת הסידור */}
        <button className="save-btn" onClick={handleSave}>
          שמור סידור
        </button>
      </div>
    </div>
  );
}
