import React from "react";
import Login from "../external_comonets/Login/Login";

export default function LoginPage({ onLogin }) {
  return (
    <div className="main">
      <div className="container">
        <Login onLogin={onLogin} />
      </div>
    </div>
  );
}
