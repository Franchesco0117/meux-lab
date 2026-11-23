import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./Checkbox";

const LABEL_TEXT =
  "He leído y acepto los Términos y Condiciones y la Política de Privacidad";

describe("Checkbox", () => {
  it("it associates the label with the input and triggers onChange on click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox label={LABEL_TEXT} checked={false} onChange={handleChange} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: LABEL_TEXT });
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("it binds the error message to aria-describedby and marks aria-invalid", async () => {
    const errorMsg = "Debes aceptar los términos y condiciones";

    render(
      <Checkbox
        label={LABEL_TEXT}
        checked={false}
        onChange={() => {}}
        error={errorMsg}
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /He leído y acepto/i,
    });
    const alert = screen.getByRole("alert");

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(alert).toHaveTextContent(errorMsg);
    expect(checkbox).toHaveAttribute("aria-describedby", alert.id);
  });

  it("it does not have accesibility violations with axe", async () => {
    const { container } = render(
      <Checkbox label={LABEL_TEXT} checked={false} onChange={() => {}} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
