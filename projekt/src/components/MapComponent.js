
"use client";
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetch('/minsk.json') 
      .then((response) => response.json())
      .then((data) => {
        if (data && data.geometry && data.geometry.coordinates) {
          let latitudes = [];
          let longitudes = [];
          const coordinates = data.geometry.coordinates[0];

          coordinates.forEach(coord => {
            const [longitude, latitude] = coord;
            latitudes.push(latitude);
            longitudes.push(longitude);
          });

          const bounds = [
            [Math.min(...latitudes), Math.min(...longitudes)],
            [Math.max(...latitudes), Math.max(...longitudes)]
          ];

          const initialMap = L.map('map', {
            center: [52.18250843554303, 21.560288691488154],
            zoom: 10,
            minZoom: 14,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(initialMap);

           L.geoJSON(data, {
          style: function (feature) {
            return {
              color: 'black', 
              weight: 1, 
              opacity: 1, 
              fillColor: 'none', 
              fillOpacity: 0.5 
            };
          }
        }).addTo(initialMap);

          fetch('http://172.16.15.116:1337/api/schools?populate=*')
            .then(response => response.json())
            .then(data => {
              data.data.forEach(school => {
                const latitude = parseFloat(school.latitude?.trim());
                const longitude = parseFloat(school.longitude?.trim());
                const nazwa = school.nazwa;
                const adres = school.adres;
                const imageUrl = school.zdjecie?.url ? `http://172.16.15.116:1337${school.zdjecie.url}` : 'https://via.placeholder.com/50';

                if (!isNaN(latitude) && !isNaN(longitude)) {
                  const markerIcon = L.icon({
                    iconUrl: imageUrl,
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50],
                  });
                  console.log(data)
                  const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(initialMap);
                  const popupContent = `<b>${nazwa}</b><br>${adres || "No address available"}`;
                  marker.bindPopup(popupContent);

                  marker.on('mouseover', () => {
                    marker.openPopup();
                  });

                  marker.on('mouseout', () => {
                    marker.closePopup();
                  });
                }
              });
            })
            .catch(error => {
              console.error('Error fetching school data:', error);
            });
        } else {
          console.error('Struktura danych z minsk.json jest niepoprawna lub brakuje "geometry" lub "coordinates".');
        }
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;





