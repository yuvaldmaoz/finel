import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";
import classes from "../assets/styles/Header.module.css";

function Header({ userRole, username }) {
  return (
    <header className={classes.header}>
      <div className="container">
        <div className={classes.headerWrap}>
          <div className={classes.logo}>
            <Link to="/Home">
              <img src={logo} alt="logo" />
              <span className={classes.slogan}>Test project</span>
            </Link>
          </div>
          <nav>
            <ul className={classes.menu}>
              {userRole === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/Home"
                      className={({ isActive }) =>
                        isActive ? classes.menuItemActive : classes.menuItem
                      }
                      end
                    >
                      🏠 בית
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        isActive ? classes.menuItemActive : classes.menuItem
                      }
                    >
                      📦 הזמנות
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/shifts"
                      className={({ isActive }) =>
                        isActive ? classes.menuItemActive : classes.menuItem
                      }
                    >
                      🗓️ שיבוצים
                    </NavLink>
                  </li>
                </>
              )}
              {userRole === "employe" && (
                <li>
                  <NavLink
                    to="/employee"
                    className={({ isActive }) =>
                      isActive ? classes.menuItemActive : classes.menuItem
                    }
                  >
                    🏠 בית
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    isActive ? classes.menuItemActive : classes.menuItem
                  }
                >
                  ✅ משימות
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Inventory"
                  className={({ isActive }) =>
                    isActive ? classes.menuItemActive : classes.menuItem
                  }
                >
                  📦 מלאי
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className={classes.usernameDisplay}>
        משתמש :{userRole}: {username}
      </div>
    </header>
  );
}

export default Header;
