import "./Loading.css";

interface LoadingProps {
  message?: string;
}

function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default Loading;
