import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { PasswordField } from "./PasswordField";

const PasswordFieldHarness = ({
  initialValue = "",
}: {
  initialValue?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <PasswordField
      label="Contraseña"
      value={value}
      onChange={setValue}
      placeholder="Ingresa tu contraseña"
      autoComplete="current-password"
    />
  );
};

describe("PasswordField", () => {
  it('initially hidden (type="password") and toggles to visible text (type="text") while retaining value and focus', async () => {
    const user = userEvent.setup();
    render(<PasswordFieldHarness initialValue="mysecretpassword123" />);

    const input = screen.getByLabelText("Contraseña");
    const toggleButton = screen.getByRole("button", {
      name: "Mostrar contraseña",
    });

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("mysecretpassword123");
    expect(toggleButton).toHaveAttribute("type", "button");

    await user.click(toggleButton);

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("mysecretpassword123");
    expect(input).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    ).toBeInTheDocument();
  });

  it("allows toggling visibility with the keyboard (Enter and Space)", async () => {
    const user = userEvent.setup();
    render(<PasswordFieldHarness initialValue="ClaveTeclado" />);

    const input = screen.getByLabelText("Contraseña");
    const toggleButton = screen.getByRole("button", {
      name: "Mostrar contraseña",
    });

    toggleButton.focus();
    await user.keyboard("{Enter}");
    expect(input).toHaveAttribute("type", "text");

    const hideButton = screen.getByRole("button", {
      name: "Ocultar contraseña",
    });
    hideButton.focus();
    await user.keyboard(" ");
    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    ).toBeInTheDocument();
  });

  it("does not violate accesibility rules with axe", async () => {
    const { container } = render(<PasswordFieldHarness />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
