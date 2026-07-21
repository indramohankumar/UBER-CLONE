import React, { useState, useEffect,useContext } from 'react';
import LocationSearchPanel from '../components/LocationSearchPanel';
import api from '../services/api';
import VehiclePanel from '../components/VehiclePanel';
import ConfrimRidePanel from './../components/ConfrimRidePanel';
import WaitingForDriverPanel from '../components/WaitingForDriverPanel';
import DriverDetailsPanel from '../components/DriverDetailsPanel';
import LiveMap from '../components/LiveMap';
import socket from '../services/socket';
import { AuthContext } from './../context/AuthContext';
import { toast } from 'react-hot-toast';
function Home() {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if(!user) return;
        socket.connect();
        
        const handleConnect = () => {
            socket.emit("join", { id: user._id, role: "user" });
        };
        
        socket.on('connect', handleConnect);
        
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.disconnect();
        };
    }, [user?._id]);
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
    const [driverLocation, setDriverLocation] = useState(null);

    useEffect(() => {
        socket.on("driver-location-update", (location) => {
            console.log("Live Driver Location:", location);
            setDriverLocation(location);
        });
        return () => {
            socket.off("driver-location-update");
        };
    }, []);
    useEffect(() => {
        socket.on("ride-completed", (ride) => {
            console.log("Ride completed:", ride);
            setCurrentRide(ride);
        });
        return () => {
            socket.off("ride-completed");
        };
    }, []);
    useEffect(() => {
        socket.on("driver-arrived", (ride) => {
            console.log("Driver has arrived at pickup location:", ride);
            setCurrentRide(ride);
        });
        return () => {
            socket.off("driver-arrived");
        };
    }, []);
    useEffect(() => {
        socket.on("ride-started", (ride) => {
            console.log("Ride has started:", ride);
            setCurrentRide(ride);
        });
        return () => {
            socket.off("ride-started");
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
        toast.error("Failed to create ride: " + (error.response?.data?.message || error.message));
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
            toast.error("Please enter pickup and destination");
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching fare:", error);
            toast.error(error.response?.data?.message || "Could not get fare estimate. Please try again.");
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

        const timerId = setTimeout(() => {
            fetchSuggestedLocations();
        }, 500);

        return () => clearTimeout(timerId);
    }, [pickup, destination, activeInput]);

    return (
        <div className="h-screen relative overflow-hidden">
            <LiveMap 
                pickup={currentRide?.pickupCoordinates || fareData?.pickupCoordinates}
                destination={currentRide?.dropoffCoordinates || fareData?.dropoffCoordinates}
                route={currentRide?.routeGeometry || fareData?.routeGeometry}
                driverLocation={driverLocation}
            />

            <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-all duration-300 z-10 ${
                    panelOpen ? 'h-[70%]' : 'h-auto'
                }`}
            >

                {!vehiclePanelOpen && !confirmRidePanelOpen && !waitingForDriver && (!currentRide || currentRide.status !== "accepted") && (
                    <>
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
                    </>
                )}

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
                {waitingForDriver && (
                    <WaitingForDriverPanel ride={currentRide} />
                )}

                {!waitingForDriver && currentRide && currentRide.status === "accepted" && (
                    <DriverDetailsPanel ride={currentRide} />
                )}
                
            </div>
        </div>
    );
}

export default Home;