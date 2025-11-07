import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the main title", () => {
    render(<Header />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Bus Departures"
    );
  });

  it("renders without title when no title is provided", () => {
    render(<Header />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders title when title is provided", () => {
    render(<Header title="Oslo S" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Oslo S"
    );
  });

  it("applies correct semantic structure", () => {
    render(<Header title="Sentrum" />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName.toLowerCase()).toBe("header");
  });

  it("handles undefined title gracefully", () => {
    render(<Header title={undefined} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
