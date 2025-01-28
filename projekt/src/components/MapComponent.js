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
        const initialMap = L.map('map').setView([52.18250843554303, 21.560288691488154], 10);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(initialMap);

        // Add the GeoJSON polygon to the map
        L.geoJSON(data).addTo(initialMap);

        // Set the map state for further interactions
        setMap(initialMap);

        // Fetch data from your API (schools with latitude and longitude)
        fetch('http://172.16.15.116:1337/api/schools?populate=*')
          .then(response => response.json())
          .then(data => {
            console.log(data);

            // Assuming each school has latitude and longitude
            data.data.forEach(school => {
              // Ensure that attributes are defined and contain latitude and longitude
              const { latitude, longitude, nazwa, adres } = school.attributes;

              // Convert latitude and longitude from strings to numbers
              const lat = parseFloat(latitude);
              const lng = parseFloat(longitude);

              // If latitude and longitude are valid, add marker
              if (!isNaN(lat) && !isNaN(lng)) {
                // Custom marker icon
                const markerIcon = new L.Icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                });

                // Add marker to the map
                L.marker([lat, lng], { icon: markerIcon })
                  .addTo(initialMap)
                  .bindPopup(`<b>${nazwa}</b><br>${adres || "No address available"}`);
              } else {
                console.warn('Invalid latitude or longitude for school:', school);
              }
            });
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
