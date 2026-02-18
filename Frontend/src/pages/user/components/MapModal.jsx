import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon (Leaflet issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapModal({
  bus,
  location,
  onClose
}) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      
      <div className="bg-white w-full h-full md:w-4/5 md:h-4/5 rounded-lg overflow-hidden relative">

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-white">
          <h2 className="text-sm font-semibold text-blue-900">
            🚌 {bus.bus_number} – Live Map
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Close
          </button>
        </div>

        {/* Map */}
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={15}
          className="w-full h-full"
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              Bus {bus.bus_number}
            </Popup>
          </Marker>
        </MapContainer>

      </div>
    </div>
  );
}
