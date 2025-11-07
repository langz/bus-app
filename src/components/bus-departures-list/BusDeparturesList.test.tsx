import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BusDeparturesList from "./BusDeparturesList";
import type { BusCall } from "../../types";

describe("BusDeparturesList", () => {
  const mockDepartures: BusCall[] = [
    {
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
    },
    {
      realtime: false,
      serviceJourney: {
        line: {
          publicCode: "11",
        },
      },
      destinationDisplay: {
        frontText: "Majorstuen",
      },
      aimedArrivalTime: "2025-11-07T14:35:00Z",
      expectedArrivalTime: "2025-11-07T14:35:00Z",
    },
  ];

  it("renders all departures", () => {
    render(<BusDeparturesList departures={mockDepartures} />);

    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("Sentrum")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Majorstuen")).toBeInTheDocument();
  });

  it("renders correct number of departure items", () => {
    render(<BusDeparturesList departures={mockDepartures} />);

    const arrivalItems = document.querySelectorAll(".departure-item");
    expect(arrivalItems).toHaveLength(2);
  });

  it("renders empty list when no departures provided", () => {
    render(<BusDeparturesList departures={[]} />);

    const arrivalItems = document.querySelectorAll(".departure-item");
    expect(arrivalItems).toHaveLength(0);
  });

  it("renders single departure correctly", () => {
    const singleArrival = [mockDepartures[0]];
    render(<BusDeparturesList departures={singleArrival} />);

    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("Sentrum")).toBeInTheDocument();

    const arrivalItems = document.querySelectorAll(".departure-item");
    expect(arrivalItems).toHaveLength(1);
  });
});
