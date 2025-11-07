import "./RefreshButton.css";

interface RefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function RefreshButton({ onClick, disabled = false }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className="refresh-button"
      disabled={disabled}
      aria-label={
        disabled ? "Refreshing departures..." : "Refresh departure information"
      }
      title={disabled ? "Refreshing..." : "Refresh departure information"}
    >
      <span role="img" aria-label="Refresh">
        🔄
      </span>
      <span className="sr-only">Refresh</span>
      <span aria-hidden="true">Refresh</span>
    </button>
  );
}

export default RefreshButton;
