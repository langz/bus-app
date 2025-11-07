import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchDepartures } from "./fetchDepartures";

describe("fetchDepartures", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch departures successfully", async () => {
    const mockData = {
      data: {
        stopPlace: {
          name: "Jernbanetorget",
          id: "NSR:StopPlace:4000",
          estimatedCalls: [],
        },
      },
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as Partial<Response>;

    const fetchSpy = vi.fn().mockResolvedValueOnce(mockResponse);
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchDepartures();

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.entur.io/journey-planner/v3/graphql",
      expect.objectContaining({
        method: "POST",
        headers: {
          "ET-Client-Name": "gjensidige-bus-app",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors", async () => {
    const fetchSpy = vi.fn().mockRejectedValueOnce(new Error("Network error"));
    vi.stubGlobal("fetch", fetchSpy);

    await expect(fetchDepartures()).rejects.toThrow("Network error");
  });
});
