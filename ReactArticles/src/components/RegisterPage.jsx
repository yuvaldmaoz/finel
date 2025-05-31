import React, { useState } from "react";
import axios from "axios";
import classes from "../external_comonets/Login/Login.module.css";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    role: "employe",
    password: "",
    email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // separate state for confirmation
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setMessage("הסיסמאות אינן תואמות");
      return;
    }
    axios
      .post("/users", form)
      .then((res) => {
        setMessage("נרשמת בהצלחה! אפשר להתחבר.");
      })
      .catch((err) => {
        setMessage(" שגיאה בהרשמה שם המשתמש או האימייל כבר קיימים");
      });
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.innerContainer}>
        <h1 className={classes.title}>הרשמה למערכת</h1>
        <form onSubmit={handleSubmit} className={classes.loginForm}>
          <div className={classes.formGroup}>
            <label htmlFor="name">שם משתמש:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={classes.input}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={classes.input}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="password">סיסמה:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={classes.input}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="confirmPassword">אימות סיסמה:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={classes.input}
            />
          </div>
          <button type="submit" className={classes.loginButton}>
            הרשמה
          </button>
          {message && (
            <div style={{ marginTop: 10, color: "red", textAlign: "center" }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
