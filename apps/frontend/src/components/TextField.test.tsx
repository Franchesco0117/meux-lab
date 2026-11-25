import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("connects the label to the input", () => {
    render(<TextField label="Email" value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("reports typing throug onChange", async () => {
    const onChange = vi.fn();
    render(<TextField label="Email" value="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Email"), "a");

    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("links the error message to the input for screen readers", () => {
    render(
      <TextField
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Invalid email");
  });

  it("has no accesibility violations", async () => {
    const { container } = render(
      <TextField
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
