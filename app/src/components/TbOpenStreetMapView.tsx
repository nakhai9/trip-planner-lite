"use client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type TbOpenStreetMapViewProps = {
  longitude?: number;
  latitude?: number;
};
function ChangeView({ latitude, longitude }: TbOpenStreetMapViewProps) {
  if (!latitude || !longitude) return null;
  const map = useMap();
  map.setView([latitude, longitude], map.getZoom());
  return null;
}
export default function TbOpenStreetMapView({
  longitude = 105.7233534,
  latitude = 9.2841226,
}: TbOpenStreetMapViewProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={18}
      scrollWheelZoom={false}
      style={{
        width: "100%",
        height: 200,
        marginTop: 4,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView latitude={latitude} longitude={longitude} />
      <Marker position={[latitude, longitude]}>
        <Popup>Hello</Popup>
      </Marker>
    </MapContainer>
  );
}
