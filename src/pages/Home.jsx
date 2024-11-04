import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth_user } from "../firebase/appConfig";
import Login from "./session/Login";
import { Link } from "react-router-dom";
import "./session/Styles/login.css";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth_user, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
        localStorage.setItem("user_firebase", JSON.stringify(userFirebase));
      } else {
        setUser(null);
        localStorage.removeItem("user_firebase");
      }
    });
  }, []);

  const logout = () => {
    signOut(auth_user)
      .then(() => {
        alert("La sesión se ha cerrado");
        localStorage.removeItem("user_firebase");
        setUser(null);
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div>
      {user ? (
        <div className="general">
          <h1>¡Hola, de nuevo!</h1>
          <p>El inicio de sesión ha sido correcto :)</p>
          <img
            src={
              user.photoURL
                ? user.photoURL
                : "https://res.cloudinary.com/dmddi5ncx/image/upload/v1729199012/practicas/usuario_tpluzt.png"
            }
            alt="Perfil"
            style={{ width: "25%" }}
          />
          <p>{user.displayName || "Usuario random"}</p>
          <p>Iniciaste sesión con el Correo: {user.email}</p>
          <div className="btnSesionIniciada">
            <div className="btnSesionIniciada1">
              <Link to="/productos">
                <button type="button" style={{ marginTop: "4px" }}>
                  Ver productos
                </button>
              </Link>
            </div>
            <div className="btnSesionIniciada2">
              <button onClick={logout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
