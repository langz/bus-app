import type { BusCall } from "../../types";
import "./BusDeparture.css";

interface BusDepartureProps {
  call: BusCall;
}

// Utility functions
const formatTime = (timeString: string): string => {
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeUntilDeparture = (timeString: string): string => {
  const now = new Date();
  const departure = new Date(timeString);
  const diffMinutes = Math.round(
    (departure.getTime() - now.getTime()) / (1000 * 60)
  );

  if (diffMinutes <= 0) return "Now";
  if (diffMinutes === 1) return "1 minute";
  if (diffMinutes < 60) return `${diffMinutes} minutes`;

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins === 0
    ? `${hours} hour${hours > 1 ? "s" : ""}`
    : `${hours} hour${hours > 1 ? "s" : ""} and ${mins} minute${
        mins > 1 ? "s" : ""
      }`;
};

const isDelayed = (call: BusCall): boolean => {
  return new Date(call.expectedArrivalTime) > new Date(call.aimedArrivalTime);
};

const hasTimeChange = (call: BusCall): boolean => {
  return (
    formatTime(call.aimedArrivalTime) !== formatTime(call.expectedArrivalTime)
  );
};

const getDelayMinutes = (call: BusCall): number => {
  const aimed = new Date(call.aimedArrivalTime);
  const expected = new Date(call.expectedArrivalTime);
  return Math.round((expected.getTime() - aimed.getTime()) / (1000 * 60));
};

// Internal Components
interface LineInfoProps {
  lineNumber: string;
  destination: string;
}

function LineInfo({ lineNumber, destination }: LineInfoProps) {
  return (
    <div className="line-info">
      <span className="line-number" aria-hidden="true">
        {lineNumber}
      </span>
      <span className="sr-only">Bus line {lineNumber}</span>

      <span className="destination" aria-hidden="true">
        {destination}
      </span>
      <span className="sr-only">to {destination}</span>
    </div>
  );
}

interface TimeDisplayProps {
  call: BusCall;
}

function TimeDisplay({ call }: TimeDisplayProps) {
  const timeChange = hasTimeChange(call);
  const delayed = isDelayed(call);
  const delayMinutes = getDelayMinutes(call);

  return (
    <div className="time-display">
      {timeChange ? (
        <>
          <span className="aimed-time" aria-hidden="true">
            {formatTime(call.aimedArrivalTime)}
          </span>
          <span className="sr-only">
            Scheduled departure {formatTime(call.aimedArrivalTime)}
          </span>

          <span className="expected-time" aria-hidden="true">
            {formatTime(call.expectedArrivalTime)}
          </span>
          <span className="sr-only">
            Expected departure {formatTime(call.expectedArrivalTime)}, in{" "}
            {getTimeUntilDeparture(call.expectedArrivalTime)}
            {delayed && `, delayed by ${delayMinutes} minutes`}
          </span>
        </>
      ) : (
        <>
          <span className="single-time" aria-hidden="true">
            {formatTime(call.expectedArrivalTime)}
          </span>
          <span className="sr-only">
            Departure time {formatTime(call.expectedArrivalTime)}, in{" "}
            {getTimeUntilDeparture(call.expectedArrivalTime)}
          </span>
        </>
      )}
    </div>
  );
}

// Main Component
function BusDeparture({ call }: BusDepartureProps) {
  // Create comprehensive screen reader description
  const getAccessibleDescription = (): string => {
    const lineNumber = call.serviceJourney.line.publicCode;
    const destination = call.destinationDisplay.frontText;
    const timeUntil = getTimeUntilDeparture(call.expectedArrivalTime);
    const departureTime = formatTime(call.expectedArrivalTime);
    const scheduledTime = formatTime(call.aimedArrivalTime);

    let timeInfo = `Departing in ${timeUntil}`;

    if (hasTimeChange(call)) {
      timeInfo += ` at ${departureTime} (scheduled for ${scheduledTime})`;
      if (isDelayed(call)) {
        timeInfo += ` - delayed by ${getDelayMinutes(call)} minutes`;
      }
    } else {
      timeInfo += ` at ${departureTime}`;
    }

    return `Bus line ${lineNumber} to ${destination}. ${timeInfo}.`;
  };

  return (
    <div
      className="departure-item"
      role="listitem"
      aria-label={getAccessibleDescription()}
      tabIndex={0}
    >
      <LineInfo
        lineNumber={call.serviceJourney.line.publicCode}
        destination={call.destinationDisplay.frontText}
      />

      <div className="time-info">
        <TimeDisplay call={call} />
      </div>
    </div>
  );
}

export default BusDeparture;
