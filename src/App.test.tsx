import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { StopPlaceResponse } from "./types";

// Mock the fetchDepartures function
vi.mock("./api", () => ({
  fetchDepartures: vi.fn(),
}));

// Import the mocked function
import { fetchDepartures } from "./api";
const mockFetchDepartures = vi.mocked(fetchDepartures);

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockStopPlaceData: StopPlaceResponse = {
    data: {
      stopPlace: {
        id: "NSR:StopPlace:4000",
        name: "Jernbanetorget",
        estimatedCalls: [
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
        ],
      },
    },
  };

  it("shows loading state initially", () => {
    mockFetchDepartures.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.getByText("Loading bus departures...")).toBeInTheDocument();
  });

  it("displays bus departures when data is loaded", async () => {
    mockFetchDepartures.mockResolvedValueOnce(mockStopPlaceData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Bus Departures")).toBeInTheDocument();
      expect(screen.getByText("Jernbanetorget")).toBeInTheDocument();
      expect(screen.getByText("21")).toBeInTheDocument();
      expect(screen.getByText("Sentrum")).toBeInTheDocument();
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("Majorstuen")).toBeInTheDocument();
    });
  });

  it("shows error state when fetch fails", async () => {
    const errorMessage = "Network error";
    mockFetchDepartures.mockRejectedValueOnce(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("⚠️ Something went wrong")).toBeInTheDocument();
      // For now, let's just check that some error message is displayed
      expect(
        screen.getByText(/error occurred|network error/i)
      ).toBeInTheDocument();
    });
  });

  it("allows retry when fetch fails", async () => {
    const user = userEvent.setup();
    mockFetchDepartures.mockRejectedValueOnce(new Error("Network error"));
    mockFetchDepartures.mockResolvedValueOnce(mockStopPlaceData);

    render(<App />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText("⚠️ Something went wrong")).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText("Try Again");
    await user.click(retryButton);

    // Should show data after retry
    await waitFor(() => {
      expect(screen.getByText("Jernbanetorget")).toBeInTheDocument();
    });

    expect(mockFetchDepartures).toHaveBeenCalledTimes(2);
  });

  it("shows refresh button and allows manual refresh", async () => {
    const user = userEvent.setup();
    mockFetchDepartures.mockResolvedValue(mockStopPlaceData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Jernbanetorget")).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();

    await user.click(refreshButton);

    expect(mockFetchDepartures).toHaveBeenCalledTimes(2);
  });

  it("displays no departures message when no data is available", async () => {
    const emptyData: StopPlaceResponse = {
      data: {
        stopPlace: {
          id: "NSR:StopPlace:4000",
          name: "Jernbanetorget",
          estimatedCalls: [],
        },
      },
    };

    mockFetchDepartures.mockResolvedValueOnce(emptyData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("main")).toHaveTextContent(
        "No departures available"
      );
    });
  });

  it("renders multiple bus departures correctly", async () => {
    mockFetchDepartures.mockResolvedValueOnce(mockStopPlaceData);

    render(<App />);

    await waitFor(() => {
      const departureItems = document.querySelectorAll(".departure-item");
      expect(departureItems).toHaveLength(2);
    });
  });
});
