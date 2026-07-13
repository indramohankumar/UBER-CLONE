import React, { useState, useEffect,useContext } from 'react';
import LocationSearchPanel from '../components/LocationSearchPanel';
import api from '../services/api';
import VehiclePanel from '../components/VehiclePanel';
import ConfrimRidePanel from './../components/ConfrimRidePanel';
import WaitingForDriverPanel from '../components/WaitingForDriverPanel';
import socket from '../services/socket';
import { AuthContext } from './../context/AuthContext';
function Home() {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if(!user) return;
        socket.connect();
        socket.emit("join", { id: user._id, role: "user" });
        return () => {
            socket.disconnect();
        };
    }, [user]);
    useEffect(() => {
        socket.on("ride-accepted", (ride) => {
            console.log("Ride accepted:", ride);
            setCurrentRide(ride);
            setWaitingForDriver(false);
        });
        return () => {
            socket.off("ride-accepted");
        };
    }, []);
    useEffect(() => {
        socket.on("driver-location-update", (location) => {
            console.log(location);
        });
        return () => {
            socket.off("driver-location-update");
        };
    }, []);
 const [pickup, setPickup] =useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
 const [suggestedLocations, setSuggestedLocations] =useState([]);
    const [activeInput, setActiveInput] = useState('');
 const [vehiclePanelOpen, setVehiclePanelOpen]=useState(false);
    const [fareData, setFareData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmRidePanelOpen, setConfirmRidePanelOpen]= useState(false);
    const [selectedVehicle, setSelectedVehicle]= useState(null);
const [currentRide, setCurrentRide] = useState(null);
const[waitingForDriver, setWaitingForDriver] = useState(false);

const handleConfirmRide =async () => {
    try {
        const { data } = await api.post(
            "/rides/create",
            {
                pickupLocation: pickup,
                dropoffLocation: destination
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setCurrentRide(data.data);

        setConfirmRidePanelOpen(false);

        setWaitingForDriver(true);


    } catch (error) {
        console.error(error);
    }
};
    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setVehiclePanelOpen(false);
        setConfirmRidePanelOpen(true);
    };

    const handleLocationSelect = (location) => {
        if (activeInput=== 'pickup') {
            setPickup(location);
        } else {
            setDestination(location);
        }
        setPanelOpen(false);
    }
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
                    panelOpen || vehiclePanelOpen || confirmRidePanelOpen|| waitingForDriver ? 'h-[70%]' : 'h-auto'
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
                    <VehiclePanel fareData={fareData}
                    onVehicleSelect={handleVehicleSelect} />
                )}

                {confirmRidePanelOpen && selectedVehicle && (
                    <ConfrimRidePanel 
                        vehicle={selectedVehicle} 
                        pickup={pickup} 
                        destination={destination}
                        fareData={fareData}
                        onBack={() => {
                            setConfirmRidePanelOpen(false);
                            setVehiclePanelOpen(true);
                        }}
                        onConfirm={handleConfirmRide}
                    />
                )}
                {waitingForDriver && currentRide && (
                    <WaitingForDriverPanel ride={currentRide} />
                )}
            </div>
        </div>
    );
}

export default Home;