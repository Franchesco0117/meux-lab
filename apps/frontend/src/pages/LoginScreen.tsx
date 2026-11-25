import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
// import { Checkbox } from "../components/Checkbox";
import { PasswordField } from "../components/PasswordField";
import { TextField } from "../components/TextField";
import { AuthLayout } from "../layouts/AuthLayout";
import { ApiError, loginUser } from "../services/auth.services";
import "./LoginScreen.css";

export const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const emailMissing = !trimmedEmail;
    const passwordMissing = !password;

    setEmailError(emailMissing ? "Ingresa tu correo electrónico." : undefined);
    setPasswordError(passwordMissing ? "Ingresa tu contraseña." : undefined);
    setGeneralError(null);

    // Se muestran todos los errores a la vez y el foco va al primer campo con error
    if (emailMissing || passwordMissing) {
      (emailMissing ? emailInputRef : passwordInputRef).current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser({ email: trimmedEmail, password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setGeneralError("Correo o contraseña incorrectos.");
          passwordInputRef.current?.focus();
        } else if (error.status === 429) {
          setGeneralError(
            "Demasiados intentos fallidos. Intenta de nuevo en 30 minutos.",
          );
        } else {
          setGeneralError(error.message || "No se pudo iniciar sesión.");
        }
      } else {
        setGeneralError(
          "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión - MEUX LAB"
      heading="Iniciar sesión"
      subtitle="Bienvenido de nuevo."
      headerAction={
        <p className="register-login">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="register-link">
            Regístrate
          </Link>
        </p>
      }
    >
      {generalError && (
        <p role="alert" className="field-error login-general-error">
          {generalError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (emailError) setEmailError(undefined);
            if (generalError) setGeneralError(null);
          }}
          placeholder="Ingresa tu correo electrónico"
          autoComplete="email"
          error={emailError}
          inputRef={emailInputRef}
        />

        <PasswordField
          label="Contraseña"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (passwordError) setPasswordError(undefined);
            if (generalError) setGeneralError(null);
          }}
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          error={passwordError}
          inputRef={passwordInputRef}
        />

        {/* <div className="login-options">
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Recordarme"
          />
          <Link to="/forgot-password" className="login-forgot">
            ¿Olvidaste la contraseña?
          </Link>
        </div> */}

        <button
          type="submit"
          aria-disabled={isSubmitting}
          className={`register-submit-btn ${
            isSubmitting ? "register-submit-btn--disabled" : ""
          }`}
        >
          Iniciar sesión
        </button>

        <div aria-live="polite" className="field-hint">
          {isSubmitting ? "Iniciando sesión..." : ""}
        </div>
      </form>
    </AuthLayout>
  );
};
