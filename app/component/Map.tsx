"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Debounce function to delay the API call
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

function LocationPicker({ country, location, onLocationSelect }) {
    const [center, setCenter] = useState([51.505, -0.09]); // Default center (London)
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Fetch the latitude and longitude of the selected country
    useEffect(() => {
        const fetchCountryLatLng = async () => {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json&limit=1`);
            const data = await response.json();
            if (data.length > 0) {
                const newCenter = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setCenter(newCenter);
                setSelectedLocation(newCenter);
                onLocationSelect(newCenter);
            }
        };

        if (country) {
            debounce(fetchCountryLatLng, 500)(); // Use debounce to delay the API call
        }
    }, [country]);

    const handleMapClick = (e) => {
        const clickedLocation = [e.latlng.lat, e.latlng.lng];
        setSelectedLocation(clickedLocation);
        onLocationSelect(clickedLocation);
    };

    return (
        <MapContainer center={center} zoom={5} style={{ height: '300px', width: '100%' }} onClick={handleMapClick}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedLocation && <Marker position={selectedLocation} />}
        </MapContainer>
    );
}

export default LocationPicker;
