"use client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type TbOpenStreetMapViewProps = {
  longitude?: number;
  latitude?: number;
};
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
        height: 150,
        marginTop: 10,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
