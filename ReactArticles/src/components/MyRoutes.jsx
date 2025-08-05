import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./MainPage";
import Inventory from "./Inventory";
import Header from "./Header";
import Footer from "./Footer";
import SinglePost from "./SinglePost";
import Main from "./Main";
import Order from "./Order";
import OrderView from "./OrderView";
import OrdersPage from "./OrdersPage";
import Task from "./Task";
import LoginPage from "./login";
import EmployeePage from "./EmployeePage"; // הוסף ייבוא
import Shifts from "./Shifts"; // הוסף ייבוא
import AddShift from "./AddShift"; // הוסף ייבוא
import ShiftsView from "./ShiftsView"; // הוסף ייבוא
import RegisterPage from "./RegisterPage"; // הוסף ייבוא לקומפוננטת הרשמה (אם קיימת)

function MyRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" or "employee"
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null); // הוספת state חדש

  // דוגמה: קבלת תפקיד מה־login
  const handleLogin = (role, username, id) => {
    setIsAuthenticated(true);
    setUsername(username);
    setUserRole(role); // role יכול להיות "admin" או "employee"
    setUserId(id);
  };

  //מתן ניתוב לדפים בהתאם לתפקיד המשתמש וביצוע בדיקות אימות
  return (
    <div className="App">
      <div className="sidebar">
        {isAuthenticated && (
          <Header userRole={userRole} username={username} id={userId} />
        )}
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/Home"
            element={
              isAuthenticated && userRole === "admin" ? (
                <MainPage username={username} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Inventory"
            element={
              isAuthenticated &&
              (userRole === "admin" || userRole === "employe") ? (
                <Inventory />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/Order"
            element={
              isAuthenticated &&
              (userRole === "admin" || userRole === "client") ? (
                <Order userRole={userRole} id={userId} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/order/:id"
            element={
              isAuthenticated &&
              (userRole === "admin" || userRole === "client") ? (
                <OrderView userRole={userRole} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/orders"
            element={
              isAuthenticated &&
              (userRole === "admin" || userRole === "client") ? (
                <OrdersPage userRole={userRole} id={userId} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              isAuthenticated &&
              (userRole === "admin" || userRole === "employe") ? (
                <Task />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/employee"
            element={
              isAuthenticated && userRole === "employe" ? (
                <EmployeePage username={username} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/shifts"
            element={
              isAuthenticated && userRole === "admin" ? (
                <Shifts />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/add-shift"
            element={
              isAuthenticated && userRole === "admin" ? (
                <AddShift />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/ShiftsView/:id"
            element={
              isAuthenticated && userRole === "admin" ? (
                <ShiftsView />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default MyRoutes;
