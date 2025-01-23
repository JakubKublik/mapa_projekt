"use client";
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON data from the public folder
    fetch('/minsk.json') // Now accessible through the public folder
      .then((response) => response.json())
      .then((data) => {
        // Create the map and set its initial view
        const initialMap = L.map('map').setView([52.18250843554303, 21.560288691488154], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(initialMap);

        // Add the GeoJSON polygon to the map
        L.geoJSON(data).addTo(initialMap);

        // Set the map state for further interactions
        setMap(initialMap);

        // Custom marker icon
        const markerIcon = new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Use custom image URL
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Add a custom marker at the center of Mińsk Mazowiecki with the custom icon
        L.marker([52.18250843554303, 21.560288691488154], { icon: markerIcon })
          .addTo(initialMap)
          .bindPopup("<b>Powiat Miński</b><br>To jest przykładowy marker z niestandardową ikoną.");
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
