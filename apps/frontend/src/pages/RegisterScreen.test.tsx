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

  it('keeps the register button active with aria-diasbled="true" until the form is completed and prevents submission with Enter', async () => {
    const user = userEvent.setup();
    renderRegisterScreen();

    const submitButton = screen.getByRole("button", { name: "Registrar" });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    const nameInput = screen.getByLabelText("Nombre");
    await user.type(nameInput, "User{Enter}");

    expect(registerUserMock).not.toHaveBeenCalled();
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "user@MediaList.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(
      screen.getByRole("checkbox", {
        name: /He leído y acepto los Términos y Condiciones y la Política de Privacidad/i,
      }),
    );

    expect(submitButton).toHaveAttribute("aria-disabled", "false");
  });

  it("submits the data and navigates to /dashboard when the backend responds with a 201 error", async () => {
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
});
