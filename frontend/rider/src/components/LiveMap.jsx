import { MapContainer, TileLayer,Marker,useMap } from "react-leaflet";
import {useEffect} from "react";
function MapBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 1) {
            map.fitBounds(positions, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
}

function LiveMap({ pickup, destination, driverLocation }) {
    const center = pickup ? [pickup.latitude, pickup.longitude] : [28.6139, 77.2090]; 
    
    const positions = [];
    
    if (pickup) {
        positions.push([pickup.latitude, pickup.longitude]);
    }
    if (destination) {
        positions.push([destination.latitude, destination.longitude]);
    }
    if (driverLocation) {
        positions.push([driverLocation.latitude, driverLocation.longitude]);
    }

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Must render MapBounds inside MapContainer for auto-zooming to work! */}
            {positions.length > 1 && <MapBounds positions={positions} />}

            {pickup && (
                <Marker position={[pickup.latitude, pickup.longitude]} />
            )}
            
            {destination && (
                <Marker position={[destination.latitude, destination.longitude]} />
            )}
            
            {driverLocation && (
                <Marker position={[driverLocation.latitude, driverLocation.longitude]} />
            )}
        </MapContainer>
    );
}

export default LiveMap;