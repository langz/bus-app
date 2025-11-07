import "./Header.css";

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header role="banner">
      <h1>
        <span role="img" aria-label="Bus">
          🚌
        </span>{" "}
        Bus Departures
      </h1>
      {title && (
        <h2>
          <span className="sr-only">Stop: </span>
          {title}
        </h2>
      )}
    </header>
  );
}

export default Header;
