import "./Error.css";

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="error-container">
      <h3>⚠️ Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default Error;
