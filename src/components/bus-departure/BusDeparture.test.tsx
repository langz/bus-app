import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BusDeparture from "./BusDeparture";
import type { BusCall } from "../../types";

describe("BusDeparture", () => {
  const mockCall: BusCall = {
    realtime: true,
    serviceJourney: {
      line: {
        publicCode: "21",
      },
    },
    destinationDisplay: {
      frontText: "Sentrum",
    },
    aimedArrivalTime: "2025-11-07T14:30:00Z",
    expectedArrivalTime: "2025-11-07T14:30:00Z",
  };

  it("renders bus line number", () => {
    render(<BusDeparture call={mockCall} />);

    expect(screen.getByText("21")).toBeInTheDocument();
  });

  it("renders destination", () => {
    render(<BusDeparture call={mockCall} />);

    expect(screen.getByText("Sentrum")).toBeInTheDocument();
  });

  it("renders formatted departure time", () => {
    render(<BusDeparture call={mockCall} />);

    const timeElement = document.querySelector(".expected-time");
    expect(timeElement).toBeInTheDocument();
    expect(timeElement?.textContent).toMatch(/\d{1,2}:\d{2}(\s?(AM|PM))?/);
  });

  it("shows realtime indicator when realtime is true", () => {
    render(<BusDeparture call={mockCall} />);

    const realtimeIndicator = document.querySelector(".realtime-indicator");
    expect(realtimeIndicator).toBeInTheDocument();
    expect(realtimeIndicator).toHaveTextContent("●");
  });

  it("does not show realtime indicator when realtime is false", () => {
    const nonRealtimeCall = { ...mockCall, realtime: false };
    render(<BusDeparture call={nonRealtimeCall} />);

    expect(
      document.querySelector(".realtime-indicator")
    ).not.toBeInTheDocument();
  });

  it("has accessibility attributes", () => {
    render(<BusDeparture call={mockCall} />);

    const realtimeIndicator = document.querySelector(".realtime-indicator");
    expect(realtimeIndicator).toHaveAttribute("title", "Real-time data");
  });

  it("handles different time formats correctly", () => {
    const callWithDifferentTime: BusCall = {
      ...mockCall,
      expectedArrivalTime: "2025-11-07T09:05:00Z",
    };

    render(<BusDeparture call={callWithDifferentTime} />);

    const timeElement = document.querySelector(".expected-time");
    expect(timeElement?.textContent).toMatch(/\d{1,2}:\d{2}(\s?(AM|PM))?/);
  });

  it("handles long destination names", () => {
    const callWithLongDestination = {
      ...mockCall,
      destinationDisplay: {
        frontText: "Universitetet Sykehus Nord via Sentrum",
      },
    };

    render(<BusDeparture call={callWithLongDestination} />);

    expect(
      screen.getByText("Universitetet Sykehus Nord via Sentrum")
    ).toBeInTheDocument();
  });

  it("handles special characters in line numbers", () => {
    const callWithSpecialLine = {
      ...mockCall,
      serviceJourney: {
        line: {
          publicCode: "21E",
        },
      },
    };

    render(<BusDeparture call={callWithSpecialLine} />);

    expect(screen.getByText("21E")).toBeInTheDocument();
  });
});
