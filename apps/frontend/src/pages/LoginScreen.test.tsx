import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ApiError, loginUser } from "../services/auth.services";
import { LoginScreen } from "./LoginScreen";

vi.mock("../services/auth.services", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../services/auth.services")>();
  return {
    ...actual,
    loginUser: vi.fn(),
  };
});

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location-pathname">{location.pathname}</div>;
};

const renderLoginScreen = (initialEntry = "/login") => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/login"
          element={
            <>
              <LoginScreen />
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <div>Dashboard View</div>
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <div>Register View</div>
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("LoginScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form and the registration link (RF0005)", () => {
    renderLoginScreen();

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();

    const registerLink = screen.getByRole("link", { name: /regístrate/i });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("displays empty field error and focuses on the first missing field upon submission", async () => {
    const user = userEvent.setup();
    renderLoginScreen();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/ingresa tu correo electrónico\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/ingresa tu contraseña\./i)).toBeInTheDocument();
    expect(emailInput).toHaveFocus();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("displays a general message with role='alert' in response to a 401 error", async () => {
    const user = userEvent.setup();
    vi.mocked(loginUser).mockRejectedValueOnce(
      new ApiError(401, "Unauthorized"),
    );

    renderLoginScreen();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "usuario@correo.com",
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), "clave-malvada");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/correo o contraseña incorrectos\./i);
    expect(screen.getByTestId("location-pathname")).toHaveTextContent("/login");
  });

  it("displays a temporary lock message with role='alert' in response to a 429 error", async () => {
    const user = userEvent.setup();
    vi.mocked(loginUser).mockRejectedValueOnce(
      new ApiError(429, "Too Many Requests"),
    );

    renderLoginScreen();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "usuario@correo.com",
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), "cualquier-clave");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/demasiados intentos/i);
    expect(screen.getByTestId("location-pathname")).toHaveTextContent("/login");
  });

  it("redirects to /dashboard when credentials are valid", async () => {
    const user = userEvent.setup();
    vi.mocked(loginUser).mockResolvedValueOnce({
      user: { id: "1", name: "Usuario Test", email: "usuario@correo.com" },
    });

    renderLoginScreen();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "  usuario@correo.com  ",
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), "secret123");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(loginUser).toHaveBeenCalledWith({
      email: "usuario@correo.com",
      password: "secret123",
    });

    await waitFor(() => {
      expect(screen.getByTestId("location-pathname")).toHaveTextContent(
        "/dashboard",
      );
    });
  });

  it("does not display accesibility violations (axe) in normal or error alert states", async () => {
    const user = userEvent.setup();
    vi.mocked(loginUser).mockRejectedValue(new ApiError(401, "Unauthorized"));

    const { container } = renderLoginScreen();

    const normalResults = await axe(container);
    expect(normalResults).toHaveNoViolations();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "usuario@correo.com",
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), "clave-malvada");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await screen.findByRole("alert");
    const alertResults = await axe(container);
    expect(alertResults).toHaveNoViolations();
  });
});
