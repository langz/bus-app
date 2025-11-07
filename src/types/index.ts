export interface BusCall {
  realtime: boolean;
  serviceJourney: {
    line: {
      publicCode: string;
    };
  };
  destinationDisplay: {
    frontText: string;
  };
  aimedArrivalTime: string;
  expectedArrivalTime: string;
}

export interface StopPlace {
  id: string;
  name: string;
  estimatedCalls: BusCall[];
}

export interface StopPlaceResponse {
  data: {
    stopPlace: StopPlace;
  };
}
