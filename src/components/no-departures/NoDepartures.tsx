import "./NoDepartures.css";

interface NoDeparturesProps {
  message?: string;
}

function NoDepartures({
  message = "No departures available",
}: NoDeparturesProps) {
  return (
    <div className="no-departures">
      <p className="no-departures-message">{message}</p>
    </div>
  );
}

export default NoDepartures;
