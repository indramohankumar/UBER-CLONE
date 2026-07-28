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

const RidePhase ={
    IDLE: 'idle',
    SEARCHING: 'searching',
    CONFIRMING: 'confirming',
    WAITING: 'waiting',
    ACCEPTED: 'accepted',
    ARRIVED: 'arrived',
    ONGOING: 'ongoing',

    COMPLETED: 'completed',
};
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
            setCurrentRide(prev => ({ ...prev, ...ride }));
            setRidePhase(RidePhase.ACCEPTED);
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
            setCurrentRide(prev => ({ ...prev, ...ride }));
            setRidePhase(RidePhase.COMPLETED);
        });
        return () => {
            socket.off("ride-completed");
        };
    }, []);
    useEffect(() => {
        socket.on("driver-arrived", (ride) => {
            console.log("Driver has arrived at pickup location:", ride);
            setCurrentRide(prev => ({ ...prev, ...ride }));
            setRidePhase(RidePhase.ARRIVED);
            toast.success("Your driver has arrived!");
        });
        return () => {
            socket.off("driver-arrived");
        };
    }, []);
    useEffect(()=> {
        socket.on("ride-started", (ride) => {
            console.log("Ride has started:", ride);
            setCurrentRide(prev => ({ ...prev, ...ride }));
            setRidePhase(RidePhase.ONGOING);
            toast.success("Your ride has started!");
        });
        return ()=> {
            socket.off("ride-started");
        };
    }, []);
    useEffect(()=> {
        socket.on("ride-cancelled", (ride) => {
            console.log("Ride has been cancelled:", ride);
            setCurrentRide(null);
            setRidePhase(RidePhase.IDLE);
            toast.error("Your ride has been cancelled.");
        });
        return ()=> {
            socket.off("ride-cancelled");
        };
    }, []);
 const [pickup, setPickup] =useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
 const [suggestedLocations, setSuggestedLocations] =useState([]);
    const [activeInput, setActiveInput] = useState('');
    const [fareData, setFareData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedVehicle, setSelectedVehicle]= useState(null);
    const [currentRide, setCurrentRide] = useState(null);
    const [ridePhase, setRidePhase] = useState(RidePhase.IDLE);
    const handleConfirmRide = async () => {
        try {
            const { data: order } = await api.post(
                "/payments/create-order",
              {
                    amount: selectedVehicle.fare
           },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Uber Clone",
                description: "Ride Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post(
                            "/payments/verify",
                            {
              razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
                           },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                }
                            }
                        );

                        const rideRes = await api.post(
                            "/rides/create",
                            {
                                pickupLocation: pickup,
                                dropoffLocation: destination,
                                vehicleType: selectedVehicle.type || selectedVehicle.vehicleType
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                }
                            }
                        );

                        
                        setCurrentRide(rideRes.data.data);
                        setRidePhase(RidePhase.WAITING);
                        toast.success("Payment Successful and Ride Created!");

                    } catch (error) {
                        console.error(error);
                        toast.error(error.response?.data?.message || "Payment verification failed");
                    }
                },
                theme: {
                    color: "#000000"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create payment order");
        }
    };
    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setRidePhase(RidePhase.CONFIRMING);
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
            setRidePhase(RidePhase.SEARCHING);
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
    const handleCancelRide= async () => {
        try {
            await api.patch(
                `/rides/${currentRide._id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setCurrentRide(null);
            setRidePhase(RidePhase.IDLE);
            setPickup('');
            setDestination('');
            setFareData(null);
            setSelectedVehicle(null);
            toast.success("Ride cancelled successfully");
        } catch (error) {
            console.error("Error cancelling ride:", error);
            toast.error(error.response?.data?.message || "Could not cancel ride. Please try again.");
        }
    };

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

                {ridePhase === RidePhase.IDLE && (
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

                {panelOpen && ridePhase === RidePhase.IDLE && (
                    <LocationSearchPanel
                        suggestedLocations={suggestedLocations}
                        activeInput={activeInput}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                {ridePhase === RidePhase.SEARCHING && fareData && (
                    <VehiclePanel fareData={fareData}
                    onVehicleSelect={handleVehicleSelect} />
                )}

                {ridePhase === RidePhase.CONFIRMING && selectedVehicle && (
                    <ConfrimRidePanel 
                        vehicle={selectedVehicle} 
                        pickup={pickup} 
                        destination={destination}
                        fareData={fareData}
                        onBack={() => setRidePhase(RidePhase.SEARCHING)}
                        onConfirm={handleConfirmRide}
                    />
                )}

                {ridePhase === RidePhase.WAITING && (
                    <WaitingForDriverPanel ride={currentRide} onCancel={handleCancelRide} />
                )}

                {ridePhase === RidePhase.ACCEPTED && currentRide && (
                    <DriverDetailsPanel ride={currentRide} onCancel={handleCancelRide} />
                )}

                {ridePhase === RidePhase.ARRIVED && (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">📍</div>
                        <h3 className="text-xl font-bold">Driver has arrived!</h3>
                        <p className="text-gray-500 mt-2">Meet your driver at the pickup point</p>
                        <p className="text-gray-400 text-sm mt-1">Share this OTP with the driver to start the ride:</p>
                        {currentRide && (
                            <div className="mt-4 text-4xl font-black tracking-widest text-green-600 bg-green-50 py-3 rounded-xl border border-green-200">
                                {currentRide.otp}
                            </div>
                        )}
                        <button onClick={handleCancelRide} className="w-full bg-red-100 text-red-600 rounded-lg py-3 font-semibold hover:bg-red-200 transition mt-6">
                            Cancel Ride
                        </button>
                    </div>
                )}

                {ridePhase === RidePhase.ONGOING && (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">🚗</div>
                        <h3 className="text-xl font-bold">Ride in progress</h3>
                        <p className="text-gray-500 mt-2">Sit back and enjoy your ride</p>
                        {currentRide && (
                            <p className="text-gray-400 text-sm mt-1">Heading to: {currentRide.destination}</p>
                        )}
                    </div>
                )}

                {ridePhase === RidePhase.COMPLETED && (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">✅</div>
                        <h3 className="text-xl font-bold">Ride Completed!</h3>
                        {currentRide && (
                            <p className="text-2xl font-black mt-2">₹{currentRide.fare}</p>
                        )}
                        <button
                            onClick={() => {
                                setCurrentRide(null);
                                setRidePhase(RidePhase.IDLE);
                                setPickup('');
                                setDestination('');
                                setFareData(null);
                                setSelectedVehicle(null);
                            }}
                            className="w-full bg-black text-white rounded-lg py-3 mt-6 font-semibold hover:bg-gray-900 transition"
                        >
                            Book Another Ride
                        </button>
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default Home;