import React, { useState, useEffect } from 'react';
import LocationSearchPanel from '../components/LocationSearchPanel';
import api from '../services/api';
import VehiclePanel from '../components/VehiclePanel';

function Home() {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [activeInput, setActiveInput] = useState('');
    const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
    const [fareData, setFareData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = (location) => {
        if (activeInput === 'pickup') {
            setPickup(location);
        } else {
            setDestination(location);
        }
        setPanelOpen(false);
    }

    // Fetch fare estimate from backend
    const handleFindRide = async () => {
        if (!pickup || !destination) {
            alert("Please enter pickup and destination");
            return;
        }

        setPanelOpen(false);
        setLoading(true);

        try {
            const { data } = await api.get(
                `/rides/get-fare?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setFareData(data.data);
            setVehiclePanelOpen(true);
        } catch (error) {
            console.error("Error fetching fare:", error);
            alert("Could not get fare estimate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSuggestedLocations = async () => {
            const query = activeInput === "pickup" ? pickup : destination;
            if (!query.trim()) {
                setSuggestedLocations([]);
                return;
            }
            try {
                const { data } = await api.get(`/maps/suggestions?input=${encodeURIComponent(query)}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSuggestedLocations(data.suggestions);
            } catch (error) {
                console.error("Error fetching suggested locations:", error);
            }
        };

        fetchSuggestedLocations();
    }, [pickup, destination, activeInput]);

    return (
        <div className="h-screen relative">
            <div className="h-full bg-gray-200">
            </div>

            <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-all duration-300 ${
                    panelOpen || vehiclePanelOpen ? 'h-[70%]' : 'h-auto'
                }`}
            >
                <h2 className="text-2xl font-semibold">Where to?</h2>

                <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        onFocus={() => {
                            setPanelOpen(true);
                            setVehiclePanelOpen(false);
                            setActiveInput('pickup');
                        }}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3"
                    />
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Where to?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => {
                            setPanelOpen(true);
                            setVehiclePanelOpen(false);
                            setActiveInput('destination');
                        }}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3"
                    />
                </div>

                <button
                    onClick={handleFindRide}
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg py-3 mt-6 font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
                >
                    {loading ? 'Finding rides...' : 'Find Ride'}
                </button>

                {panelOpen && (
                    <LocationSearchPanel
                        suggestedLocations={suggestedLocations}
                        activeInput={activeInput}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                {vehiclePanelOpen && fareData && (
                    <VehiclePanel fareData={fareData} />
                )}
            </div>
        </div>
    );
}

export default Home;