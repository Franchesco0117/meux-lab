import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Checkbox } from "../components/Checkbox";
import { TextField } from "../components/TextField";
import { AuthLayout } from "../layouts/AuthLayout";
import { ApiError, registerUser } from "../services/auth.services";
import "./RegisterScreen.css";
import "../styles/variables.css";
import { PasswordField } from "../components/PasswordField";

export const RegisterScreen = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [termsError, setTermsError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const PASSWORD_RULE = "La contraseña debe tener al menos 8 caracteres.";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const nameMissing = !trimmedName;
    const emailMissing = !trimmedEmail;
    const passwordShort = password.length < 8;
    const termsMissing = !termsAccepted;

    setNameError(nameMissing ? "Ingresa tu nombre." : undefined);
    setEmailError(emailMissing ? "Ingresa tu correo electrónico." : undefined);
    setPasswordError(passwordShort ? PASSWORD_RULE : undefined);
    setTermsError(
      termsMissing
        ? "Debes aceptar los Términos y Condiciones y la Política de Privacidad."
        : undefined,
    );
    setGeneralError(null);

    if (nameMissing || emailMissing || passwordShort || termsMissing) {
      if (nameMissing) nameInputRef.current?.focus();
      else if (emailMissing) emailInputRef.current?.focus();
      else if (passwordShort) passwordInputRef.current?.focus();
      else emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        termsAccepted,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setEmailError("Este correo ya está registrado");
          emailInputRef.current?.focus();
        } else if (error.status === 400) {
          setGeneralError(error.message);
        } else {
          setGeneralError(error.message || "No se pudo completar el registro.");
        }
      } else {
        setGeneralError(
          "No se pudo conectar con el servidor. Verifica tu conexión e Inténtalo de nuevo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta - MEUX LAB"
      heading="Crear cuenta"
      subtitle="Solo te tomará un minuto."
      headerAction={
        <p className="register-login">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="register-link">
            Inicia sesión
          </Link>
        </p>
      }
    >
      {/* Body */}
      {generalError && (
        <p
          role="alert"
          className="field-error"
          style={{ marginBottom: "16px" }}
        >
          {generalError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <TextField
          label="Nombre"
          value={name}
          onChange={(val) => {
            setName(val);
            if (nameError) setNameError(undefined);
          }}
          placeholder="Ingresa tu nombre"
          autoComplete="name"
          error={nameError}
          inputRef={nameInputRef}
        />

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
          }}
          placeholder="Ingresa tu contraseña"
          hint={PASSWORD_RULE}
          autoComplete="new-password"
          error={passwordError}
          inputRef={passwordInputRef}
        />

        <Checkbox
          checked={termsAccepted}
          onChange={(checked) => {
            setTermsAccepted(checked);
            if (termsError) setTermsError(undefined);
          }}
          error={termsError}
          label={
            <>
              He leído y acepto los{" "}
              <Link to="/terms">Términos y Condiciones</Link> y la{" "}
              <Link to="/privacy">Política de Privacidad</Link>
            </>
          }
        />

        <button
          type="submit"
          aria-disabled={isSubmitting}
          className={`register-submit-btn ${
            isSubmitting ? "register-submit-btn--disabled" : ""
          }`}
        >
          Registrar
        </button>

        <div aria-live="polite" className="field-hint">
          {isSubmitting ? "Creando cuenta..." : ""}
        </div>
      </form>
    </AuthLayout>
  );
};
