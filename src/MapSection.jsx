import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapSection() {
  return (
    <MapContainer
      center={[-6.2000, 106.8219]} // Jakarta
      zoom={13}
      className="w-full h-[350px] rounded-2xl"
    >
      {/* DARK MODE MAP */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* MARKER */}
      <Marker position={[-6.2000, 106.8219]}>
        <Popup>
          ⚡ ChargeFlow Station — SCBD
        </Popup>
      </Marker>

    </MapContainer>
  );
}