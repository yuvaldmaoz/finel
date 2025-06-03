import React, { useState } from "react";
import "../assets/styles/AddTaskPopup.css";

export default function AddTaskPopup({ onAdd, onClose, employeeList }) {
  const [taskData, setTaskData] = useState({
    title: "",
    status: "pending",
    user_id: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(taskData);
    onClose();
  };

  const handleChange = (e) => {
    //לחדד
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>הוספת משימה חדשה</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">כותרת</label>
            <input
              type="text"
              id="title"
              name="title" //מתיחס לשם המפתח באובייקט
              value={taskData.title} //מתיחס לערך שם המפתח שנמצא באובייקט
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_id">עובד תפעולי</label>
            <select
              id="user_id"
              name="user_id"
              value={taskData.user_id}
              onChange={handleChange}
              required
            >
              <option value="">בחר עובד</option>
              {employeeList.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">תאריך</label>
            <input
              type="date"
              id="date"
              name="date"
              value={taskData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              הוסף משימה
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
