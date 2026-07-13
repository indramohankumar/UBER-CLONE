import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
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

const carIcon = new L.DivIcon({
    html: `<div style="font-size: 24px; animation: pulse 2s infinite;">🚗</div>`,
    className: 'custom-car-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const MapBounds = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
};

const LiveMap = ({ pickup, destination, driverLocation, route }) => {
    const [decodedRoute, setDecodedRoute] = useState([]);

    useEffect(() => {
        if (route) {
            try {
                const decoded = polylineDecoder.decode(route);
                setDecodedRoute(decoded);
            } catch (err) {
                console.error("Error decoding route:", err);
            }
        } else {
            setDecodedRoute([]);
        }
    }, [route]);
    const allPositions = [];
    if (pickup) allPositions.push([pickup.latitude, pickup.longitude]);
    if (destination) allPositions.push([destination.latitude, destination.longitude]);
    
    const boundsPositions = decodedRoute.length > 0 ? decodedRoute : allPositions;


    const center = pickup 
        ? [pickup.latitude, pickup.longitude] 
        : [28.6139, 77.2090];

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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {boundsPositions.length > 0 && (
                    <MapBounds positions={boundsPositions} />
                )}

                {pickup && (
                    <Marker position={[pickup.latitude, pickup.longitude]} />
                )}

                {destination && (
                    <Marker position={[destination.latitude, destination.longitude]} />
                )}

                {driverLocation && (
                    <Marker 
                        position={[driverLocation.latitude, driverLocation.longitude]} 
                        icon={carIcon} 
                    />
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
};

export default LiveMap;
