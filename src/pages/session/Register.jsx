import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth_user } from "../../firebase/appConfig";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Styles/login.css";

// Esquema de validación
const schema = yup.object().shape({
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("Correo inválido, ejemplo: usuario@dominio.com"),
  password: yup
    .string()
    .required("Campo Obligatorio")
    .min(8, "La contraseña debe contener al menos 8 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas no son iguales"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const registerForm = (data) => {
    createUserWithEmailAndPassword(auth_user, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Swal.fire({
            title: "Correo ya registrado",
            text: "El correo ya está en uso, intenta con otro o inicia sesión",
            icon: "warning",
          });
        } else {
          console.log("Error al registrar el usuario:", error);
          Swal.fire({
            title: "Error en el registro",
            text: "Hubo un problema al crear tu cuenta. Intenta nuevamente.",
            icon: "error",
          });
        }
      });
  };

  return (
    <div className="general">
      <h1>Para los nuevos</h1>
      <form onSubmit={handleSubmit(registerForm)}>
        <div className="formulario">
          <div className="container_formulario">
            <div>
              <label>Correo Electrónico: </label>
            </div>
            <div>
              <input
                type="email"
                placeholder="Ingrese su correo"
                {...register("email", { required: true })}
              />
            </div>

            <span style={{ color: "red" }}>
              {errors.email && errors.email.message}
            </span>
            <div>
              <label>Contraseña: </label>
            </div>
            <div>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                {...register("password", { required: true })}
              />
            </div>
            <span style={{ color: "red" }}>
              {errors.password && errors.password.message}
            </span>
            <div>
              <label>Confirmar Contraseña: </label>
            </div>
            <div>
              <input type="password" {...register("confirmPassword")} />
            </div>
            <span style={{ color: "red" }}>
              {errors.confirmPassword && errors.confirmPassword.message}
            </span>
          </div>
          <hr />

          <div className="btn_registrate">
            <div className="btn_registrate1">
              <button type="submit">Registrarse</button>
            </div>
            <div className="btn_registrate2">
              <Link to="/">
                <button type="button" style={{ paddingTop: "10px" }}>
                  Volver
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
