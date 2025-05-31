import React from "react";
import "./ShiftsTable.css";

function ShiftsTable({ data }) {
  return (
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
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.UserName}</td>
                <td>{row.ShiftDate}</td>
                <td
                  className={
                    row.ShiftType === "Morning" ? "morning" : "evening"
                  }
                >
                  {row.ShiftType === "morning" ? "בוקר" : "ערב"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                אין נתונים
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShiftsTable;
