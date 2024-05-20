import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlrYXMwOTU5IiwiYSI6ImNsd2RiZ3Z3YzE1NmUya2xkbnBnbWVydWIifQ.x1tMqUCvQ03skxFxKGPIoQ';

const Map = ({ latitude, longitude }) => {
    console.log(latitude,longitude)
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (!latitude || !longitude) {
            console.error('Latitude and Longitude are required');
            return;
        }

        if (map.current) return; // Initialize map only once

        if (mapContainer.current) {
            try {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [longitude, latitude],
                    zoom: 12,
                });

                new mapboxgl.Marker()
                    .setLngLat([longitude, latitude])
                    .addTo(map.current);
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }
    }, [latitude, longitude]);

    return (
        <div >
            <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
            {!latitude || !longitude ? <p>Error: Invalid latitude or longitude</p> : null}
        </div>
    );
};

export default Map;
