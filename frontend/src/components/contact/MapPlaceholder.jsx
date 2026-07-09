import { motion } from 'framer-motion';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const officePosition = [37.7749, -122.4194];
const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=37.7749,-122.4194';

const officeIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapPlaceholder() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-7 sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Visit Us</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
                HomeBite Headquarters
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                Our team is based in San Francisco and works with food communities everywhere.
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="relative min-h-[380px] lg:min-h-[520px]">
              <MapContainer
                center={officePosition}
                zoom={13}
                scrollWheelZoom={false}
                className="absolute inset-0 z-0 h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={officePosition} icon={officeIcon}>
                  <Popup>
                    <div className="space-y-3">
                      <strong>HomeBite Headquarters</strong>
                      <br />
                      San Francisco, CA
                      <br />
                      <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                        Open in Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
