import { useEffect, useState, useCallback } from "react";
import { fetchDepartures } from "./api";
import type { StopPlaceResponse } from "./types";
import "./App.css";
import {
  Loading,
  Error,
  NoDepartures,
  BusDeparturesList,
  Header,
  RefreshButton,
} from "./components";

function App() {
  const [data, setData] = useState<StopPlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");

  const loadDepartures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAnnouncement("Loading bus departures...");
      const stopPlaceData = await fetchDepartures();
      setData(stopPlaceData);
      const departureCount = stopPlaceData?.data?.stopPlace?.estimatedCalls?.length || 0;
      setAnnouncement(departureCount > 0 ? `Loaded ${departureCount} departures` : "No departures available");
    } catch (err: unknown) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      setAnnouncement("Failed to load departures");
      console.error("Failed to fetch departures:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartures();
  }, [loadDepartures]);

  if (loading) return <Loading message="Loading bus departures..." />;
  if (error) return <Error message={error} onRetry={loadDepartures} />;

  const stopPlace = data?.data?.stopPlace;

  return (
    <div className="app">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      
      <Header title={stopPlace?.name} />

      <main role="main" aria-label="Bus departure information">
        {stopPlace?.estimatedCalls && stopPlace.estimatedCalls.length > 0 ? (
          <BusDeparturesList departures={stopPlace.estimatedCalls} />
        ) : (
          <NoDepartures />
        )}
      </main>

      <RefreshButton onClick={loadDepartures} disabled={loading} />
    </div>
  );
}

export default App;
