import type { StopPlaceResponse } from "../../types";

export async function fetchDepartures(): Promise<StopPlaceResponse> {
  const stopPlaceIdJernBanetorget = "NSR:StopPlace:4000";
  const apiUrl = "https://api.entur.io/journey-planner/v3/graphql";
  const clientName = "gjensidige-bus-app";

  const query = `{
  stopPlace(id: "${stopPlaceIdJernBanetorget}") {
    name
    id
    estimatedCalls(
      numberOfDepartures: 5
      whiteListedModes: bus
      arrivalDeparture: departures
    ) {
      realtime
      serviceJourney {
        line {
          publicCode
        }
      }
      destinationDisplay {
        frontText
      }
      aimedArrivalTime
      expectedArrivalTime
    }
  }
}
`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "ET-Client-Name": clientName,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch departures: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `GraphQL errors: ${data.errors
        .map((e: { message: string }) => e.message)
        .join(", ")}`
    );
  }

  return data;
}

export default fetchDepartures;
