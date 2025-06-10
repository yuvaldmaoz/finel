import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("users/Login", { email, password })
      .then((response) => {
        if (response.data.message === "Login successful") {
          const isAdmin = response.data.role === "admin";
          alert(isAdmin ? "התחברת בהצלחה כמנהל!" : "התחברת בהצלחה כעובד!");
          onLogin(response.data.role, response.data.name, response.data.id);
          navigate("/Home");
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert("שם משתמש או סיסמה שגויים");
        } else {
          alert("שגיאה בהתחברות");
        }
      });
  };

  return (
    <div className={classes.loginContainer}>
      <h1 className={classes.title}>ברוכים הבאים למערכת</h1>
      <form onSubmit={handleSubmit} className={classes.loginForm}>
        <div className={classes.formGroup}>
          <label htmlFor="email">אימייל:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="password">סיסמה:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={classes.loginButton}>
          התחבר
        </button>

        <button
          type="button"
          className={classes.loginButton}
          onClick={() => navigate("/register")}
          style={{ marginTop: "10px" }}
        >
          הרשמה
        </button>
      </form>
    </div>
  );
}
