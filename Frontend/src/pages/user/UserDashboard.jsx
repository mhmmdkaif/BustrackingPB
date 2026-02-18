import { useState, useEffect } from "react";
import api from "../../api/api";
import { io } from "socket.io-client";

// Components
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import ResultsSection from "./components/ResultsSection";
import BusTrackingPanel from "./components/BusTrackingPanel";
import MapModal from "./components/MapModal";

const socket = io("http://localhost:5000");

export default function UserDashboard() {
  /* -------------------- STATE -------------------- */

  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState(null); // null = not searched yet
  const [selectedBus, setSelectedBus] = useState(null);

  const [liveLocation, setLiveLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  /* -------------------- INITIAL LOAD -------------------- */

  useEffect(() => {
    // Load stops for source-destination dropdown
    const fetchStops = async () => {
      const res = await api.get("/stops");
      setStops(res.data);
    };

    fetchStops();
  }, []);

  /* -------------------- SOCKET LISTENER -------------------- */

  useEffect(() => {
    socket.on("receiveLocation", (data) => {
      if (selectedBus && data.bus_id === selectedBus.id) {
        setLiveLocation(data);
      }
    });

    return () => socket.off("receiveLocation");
  }, [selectedBus]);

  /* -------------------- HANDLERS -------------------- */

  // Source → Destination search
  const handleRouteSearch = async ({ source, destination }) => {
  try {
    setSelectedBus(null);
    setLiveLocation(null);

    const res = await api.get(
      `/search/buses?sourceStopId=${source}&destinationStopId=${destination}`
    );

    setBuses(res.data);
  } catch (err) {
    console.error(err);
    setBuses([]);
  }
};


  // Track bus
  const handleTrackBus = async (bus) => {
    setSelectedBus(bus);
    setShowMap(false);

    try {
      const locRes = await api.get(`/location/${bus.id}`);
      setLiveLocation(locRes.data);
    } catch {
      setLiveLocation(null);
    }
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <Header />

      {/* Search */}
      <SearchSection
        stops={stops}
        onRouteSearch={handleRouteSearch}
      />

      {/* Results */}
      <ResultsSection
        buses={buses}
        liveBusData={
          selectedBus && liveLocation
            ? { [selectedBus.id]: liveLocation }
            : {}
        }
        onTrackBus={handleTrackBus}
      />

      {/* Tracking Panel */}
      <BusTrackingPanel
        bus={selectedBus}
        location={liveLocation}
        onOpenMap={() => setShowMap(true)}
        onClose={() => {
          setSelectedBus(null);
          setLiveLocation(null);
        }}
      />

      {/* Map Modal */}
      {showMap && (
        <MapModal
          bus={selectedBus}
          location={liveLocation}
          onClose={() => setShowMap(false)}
        />
      )}

    </div>
  );
}
