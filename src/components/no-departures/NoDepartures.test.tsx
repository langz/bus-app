import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoDepartures from "./NoDepartures";

describe("NoDepartures", () => {
  it("renders default message when no message provided", () => {
    render(<NoDepartures />);

    expect(screen.getByText("No departures available")).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    const customMessage = "No buses found for this stop";
    render(<NoDepartures message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders message in a paragraph element", () => {
    render(<NoDepartures />);

    const messageElement = screen.getByText("No departures available");
    expect(messageElement.tagName).toBe("P");
  });
});
