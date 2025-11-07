import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RefreshButton from "./RefreshButton";

describe("RefreshButton", () => {
  it("renders refresh button with correct text", () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: "🔄 Refresh" });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("is enabled by default", () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("can be disabled when disabled prop is true", () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled and clicked", () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
