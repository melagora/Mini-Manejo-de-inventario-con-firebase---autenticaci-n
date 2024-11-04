import React from "react";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
} from "firebase/auth";
import { auth_user, providerGoogle } from "../../firebase/appConfig";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "./Styles/login.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Método para iniciar sesión con correo y contraseña
  const loginForm = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth_user,
        data.email,
        data.password
      );
      const user = userCredential.user;

      saveLocalStorage("user_firebase", JSON.stringify(user));
      window.location.href = "/";
    } catch (error) {
      console.error("Error en inicio de sesión:", error.message);
      Swal.fire({
        title: "Credenciales inválidas",
        text: "Revisa tu información",
        icon: "warning",
      });
    }
  };

  // Método para iniciar sesión con Google
  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth_user, providerGoogle);
      const user = result.user;

      // Guardar datos en localStorage
      saveLocalStorage("user_firebase", JSON.stringify(user));
      window.location.href = "/";
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        // Si la cuenta ya existe con un método diferente, obtenemos el correo y credencial pendientes
        const pendingCred = error.credential;
        const email = error.customData.email;

        // Verificar métodos de inicio de sesión asociados al correo
        const methods = await fetchSignInMethodsForEmail(auth_user, email);

        if (methods.includes(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
          // Solicitar al usuario que ingrese su contraseña para vincular cuentas
          const password = prompt(
            "Ya tienes una cuenta con correo/contraseña. Ingresa tu contraseña para vincular ambas cuentas:"
          );
          const emailCredential = EmailAuthProvider.credential(email, password);

          try {
            // Iniciar sesión con el método de correo y luego vincular la credencial de Google
            const userCredential = await signInWithEmailAndPassword(
              auth_user,
              email,
              password
            );
            await linkWithCredential(userCredential.user, pendingCred);

            // Guardar datos en localStorage
            saveLocalStorage(
              "user_firebase",
              JSON.stringify(userCredential.user)
            );
            Swal.fire("Cuentas vinculadas exitosamente", "", "success");
            window.location.href = "/";
          } catch (linkError) {
            console.error("Error al vincular cuenta:", linkError);
            Swal.fire("Error al vincular cuenta", linkError.message, "error");
          }
        } else {
          console.error("Otro método de inicio de sesión asociado:", methods);
          Swal.fire({
            title: "Error al vincular cuenta",
            text: "Ya existe una cuenta asociada con un método diferente. Intenta iniciar sesión con el método adecuado.",
            icon: "warning",
          });
        }
      } else {
        console.error("Error en inicio de sesión con Google:", error.message);
        Swal.fire({
          title: "Error al autenticarse con Google",
          text: error.message,
          icon: "warning",
        });
      }
    }
  };

  // Método para guardar datos en localStorage
  const saveLocalStorage = (key, data) => {
    localStorage.setItem(key, data);
  };

  return (
    <div className="general">
      <h1>Inicio de sesión</h1>
      <form onSubmit={handleSubmit(loginForm)}>
        <div className="formulario">
          <div>
            <label>Ingresa tu correo Electrónico: </label>
          </div>
          <div>
            <input
              type="email"
              placeholder="Ingrese su correo"
              {...register("email", { required: true })}
            />
          </div>
          {errors.email && (
            <span style={{ color: "red" }}>Campo Obligatorio</span>
          )}
          <div>
            <label>Ingresa tu Contraseña:</label>
          </div>
          <div>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && (
            <span style={{ color: "red" }}>Campo Obligatorio</span>
          )}
        </div>
        <hr />

        <div className="btn_inicio_sesion">
          <div className="btn_inicio_sesion1">
            <button type="submit">Iniciar Sesión</button>
          </div>
          <div className="btn_inicio_sesion2">
            <button onClick={loginGoogle}>Ingresar con Google</button>
          </div>
        </div>
      </form>

      <section>
        <p>
          Si no tienes cuenta <Link to="/registrar">Regístrate Aquí!</Link>
        </p>
      </section>
    </div>
  );
}
