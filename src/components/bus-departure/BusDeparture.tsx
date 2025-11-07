import type { BusCall } from "../../types";
import "./BusDeparture.css";

interface BusDepartureProps {
  call: BusCall;
}

function BusDeparture({ call }: BusDepartureProps) {
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

  const isDelayed = (): boolean => {
    return new Date(call.expectedArrivalTime) > new Date(call.aimedArrivalTime);
  };

  const hasTimeChange = (): boolean => {
    return (
      formatTime(call.aimedArrivalTime) !== formatTime(call.expectedArrivalTime)
    );
  };

  const getDelayMinutes = (): number => {
    const aimed = new Date(call.aimedArrivalTime);
    const expected = new Date(call.expectedArrivalTime);
    return Math.round((expected.getTime() - aimed.getTime()) / (1000 * 60));
  };

  // Create comprehensive screen reader description
  const getAccessibleDescription = (): string => {
    const lineNumber = call.serviceJourney.line.publicCode;
    const destination = call.destinationDisplay.frontText;
    const timeUntil = getTimeUntilDeparture(call.expectedArrivalTime);
    const departureTime = formatTime(call.expectedArrivalTime);
    const scheduledTime = formatTime(call.aimedArrivalTime);

    let timeInfo = `Departing in ${timeUntil}`;

    if (hasTimeChange()) {
      timeInfo += ` at ${departureTime} (scheduled for ${scheduledTime})`;
      if (isDelayed()) {
        timeInfo += ` - delayed by ${getDelayMinutes()} minutes`;
      }
    } else {
      timeInfo += ` at ${departureTime}`;
    }

    const realtimeInfo = call.realtime ? " Real-time data available." : "";

    return `Bus line ${lineNumber} to ${destination}. ${timeInfo}.${realtimeInfo}`;
  };

  return (
    <div
      className="departure-item"
      role="listitem"
      aria-label={getAccessibleDescription()}
      tabIndex={0}
    >
      <div className="line-info">
        <span className="line-number" aria-hidden="true">
          {call.serviceJourney.line.publicCode}
        </span>
        <span className="sr-only">
          Bus line {call.serviceJourney.line.publicCode}
        </span>

        <span className="destination" aria-hidden="true">
          {call.destinationDisplay.frontText}
        </span>
        <span className="sr-only">to {call.destinationDisplay.frontText}</span>
      </div>

      <div className="time-info">
        {hasTimeChange() ? (
          <>
            <span className="aimed-time" aria-hidden="true">
              {formatTime(call.aimedArrivalTime)}
            </span>
            <span className="sr-only">
              Scheduled departure {formatTime(call.aimedArrivalTime)}
            </span>

            <span className="expected-time" aria-hidden="true">
              {formatTime(call.expectedArrivalTime)}
              {isDelayed() && (
                <span className="delay-indicator"> +{getDelayMinutes()}m</span>
              )}
            </span>
            <span className="sr-only">
              Expected departure {formatTime(call.expectedArrivalTime)}, in{" "}
              {getTimeUntilDeparture(call.expectedArrivalTime)}
              {isDelayed() && `, delayed by ${getDelayMinutes()} minutes`}
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

        {call.realtime && (
          <>
            <span
              className="realtime-indicator"
              aria-hidden="true"
              title="Real-time data"
            >
              ●
            </span>
            <span className="sr-only">Real-time data available</span>
          </>
        )}
      </div>
    </div>
  );
}

export default BusDeparture;
