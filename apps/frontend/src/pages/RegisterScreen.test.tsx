import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ApiError } from "../services/auth.services";
import { RegisterScreen } from "./RegisterScreen";

const registerUserMock = vi.fn();

vi.mock("../services/auth.services", async () => {
  const actual = await vi.importActual<
    typeof import("../services/auth.services")
  >("../services/auth.services");
  return {
    ...actual,
    registerUser: (...args: unknown[]) => registerUserMock(...args),
  };
});

function renderRegisterScreen() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<h1>Dashboard principal</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillAndSubmitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nombre"), "User");
  await user.type(screen.getByLabelText("Correo electrónico"), "user@mail.com");
  await user.type(screen.getByLabelText("Contraseña"), "secret123");
  await user.click(
    screen.getByRole("checkbox", {
      name: /He leído y acepto los Términos y Condiciones y la Política de Privacidad/i,
    }),
  );
  await user.click(screen.getByRole("button", { name: "Registrar" }));
}

describe("RegisterScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the data and navigates to /dashboard when the backend responds with a 201", async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValueOnce({
      id: "1",
      name: "User",
      email: "user@mail.com",
    });

    renderRegisterScreen();
    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith({
        name: "User",
        email: "user@mail.com",
        password: "secret123",
        termsAccepted: true,
      });
    });

    expect(
      await screen.findByRole("heading", { name: "Dashboard principal" }),
    ).toBeInTheDocument();
  });

  it('it shows "This email is already registered" and focuses the email field upon receiving a 409 error', async () => {
    const user = userEvent.setup();
    registerUserMock.mockRejectedValueOnce(new ApiError(409, "Confilt"));

    renderRegisterScreen();
    await fillAndSubmitForm(user);

    const emailInput = screen.getByLabelText("Correo electrónico");
    expect(
      await screen.findByText("Este correo ya está registrado"),
    ).toBeInTheDocument();
    expect(emailInput).toHaveFocus();
  });

  it("allow users to navigate through the main controls with Tab and has no axe violations", async () => {
    const user = userEvent.setup();
    const { container } = renderRegisterScreen();

    await user.tab();
    expect(screen.getByLabelText("Nombre")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Correo electrónico")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Contraseña")).toHaveFocus();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("it allows you to show and hide the password during registration without submitting the form", async () => {
    const user = userEvent.setup();
    renderRegisterScreen();

    const passwordInput = screen.getByLabelText("Contraseña");
    const toggleButton = screen.getByRole("button", {
      name: "Mostrar contraseña",
    });

    await user.type(passwordInput, "secret123");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(registerUserMock).not.toHaveBeenCalled();
  });
});
