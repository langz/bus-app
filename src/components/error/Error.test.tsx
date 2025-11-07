import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Error from "./Error";

describe("Error", () => {
  it("renders message", () => {
    const errorMessage = "Something went wrong";
    render(<Error message={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
