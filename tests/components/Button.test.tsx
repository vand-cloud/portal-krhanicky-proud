import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Klikni sem</Button>);
    expect(screen.getByRole("button", { name: "Klikni sem" })).toBeInTheDocument();
  });

  it("applies solid variant by default", () => {
    render(<Button>Solid</Button>);
    const button = screen.getByRole("button", { name: "Solid" });
    expect(button.className).toContain("bg-[var(--color-brand)]");
    expect(button.className).toContain("text-[var(--color-bg)]");
  });

  it("applies outline variant when variant=\"outline\"", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button", { name: "Outline" });
    expect(button.className).toContain("border");
    expect(button.className).toContain("border-[var(--color-border)]");
    expect(button.className).not.toContain("bg-[var(--color-brand)]");
  });

  it("has focus-visible:ring-2 class for a11y", () => {
    render(<Button>Focus</Button>);
    const button = screen.getByRole("button", { name: "Focus" });
    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("focus-visible:ring-[var(--color-accent)]");
    expect(button.className).toContain("focus-visible:ring-offset-2");
  });

  it("forwards disabled prop to underlying <button>", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });
});
