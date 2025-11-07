import BusDeparture from "../bus-departure/BusDeparture";
import type { BusCall } from "../../types";
import "./BusDeparturesList.css";

interface BusDeparturesListProps {
  departures: BusCall[];
}

function BusDeparturesList({ departures }: BusDeparturesListProps) {
  return (
    <div
      className="bus-departures-list"
      role="list"
      aria-label={`${departures.length} bus departures`}
    >
      {departures.map((busCall, index) => (
        <BusDeparture
          key={`${busCall.serviceJourney.line.publicCode}-${busCall.destinationDisplay.frontText}-${busCall.expectedArrivalTime}-${index}`}
          call={busCall}
        />
      ))}
    </div>
  );
}

export default BusDeparturesList;
