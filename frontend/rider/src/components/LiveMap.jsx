import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import polylineDecoder from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});
function MapBounds({ positions }) {
    const map = useMap();
    
    useEffect(() => {
        if (positions.length > 1) {
            // Adds professional padding so markers aren't touching the edge of the screen
            map.fitBounds(positions, { padding: [50, 50] });
        }
    }, [positions, map]);
    
    return null;
}

function LiveMap({ pickup, destination, driverLocation, route }) {
    const [decodedRoute, setDecodedRoute] = useState([]);
    useEffect(() => {
        if (route) {
            try {
                const decoded = polylineDecoder.decode(route);
                setDecodedRoute(decoded);
            } catch (error) {
                console.error("Failed to decode route:", error);
            }
        }
    }, [route]);

    const markerPositions = [];
    if (pickup) markerPositions.push([pickup.latitude, pickup.longitude]);
    if (destination) markerPositions.push([destination.latitude, destination.longitude]);
    if (driverLocation) markerPositions.push([driverLocation.latitude, driverLocation.longitude]);
    const center = pickup ? [pickup.latitude, pickup.longitude] : [28.6139, 77.2090];

    return (
        <div className="h-full w-full z-0 relative">
            <MapContainer
                center={center}
                zoom={13}
                zoomControl={false}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {markerPositions.length > 1 && (
                    <MapBounds positions={markerPositions} />
                )}

                {pickup && (
                    <Marker position={[pickup.latitude, pickup.longitude]} />
                )}
                {destination && (
                    <Marker position={[destination.latitude, destination.longitude]} />
                )}
                
                {/* Plot the live driver location */}
                {driverLocation && (
                    <Marker position={[driverLocation.latitude, driverLocation.longitude]} />
                )}
                {decodedRoute.length > 0 && (
                    <Polyline 
                        positions={decodedRoute} 
                        color="#000000" 
                        weight={4} 
                        opacity={0.8} 
                    />
                )}
            </MapContainer>
        </div>
    );
}

export default LiveMap;