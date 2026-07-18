import React, { useState, useContext, useEffect } from 'react';
import DriverAuthContext from '../context/DriverAuthContext';
import api from '../services/api';
import socket from '../services/socket';
import RideRequestPanel from '../componenets/RideRequestPanel';
import AcceptedRidePanel from '../componenets/AcceptedRidePanel';
const RideStatus = {
    IDLE: 'idle',
    ACCEPTED: 'accepted',
    ARRIVED: 'arrived',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
};

function DriverHome() {
    const { driver }= useContext(DriverAuthContext);

    const [newRide, setNewRide] = useState(null);
    const [currentRide, setCurrentRide] = useState(null);
    const [rideStatus, setRideStatus] = useState(RideStatus.IDLE);
    useEffect(() => {
        if (!driver) return;
        socket.connect();
        socket.emit('join', { id: driver._id, role: 'driver' });
        return () => {
            socket.disconnect();
        };
    }, [driver?._id]);

    useEffect(() => {
        if (!driver) return;
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.');
            return;
        }
        const watchId= navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('location-update', { latitude, longitude });
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [driver?._id]);
    useEffect(() => {
        const handleNewRide=(ride) => {
            setNewRide(ride);
        };
        socket.on('new-ride', handleNewRide);
        return () => {
            socket.off('new-ride', handleNewRide);
        };
    }, []);

    const handleAcceptRide = async (rideId) => {
        try {
            const response = await api.patch(`/rides/${rideId}/accept`);
            // Only NOW does it become the current ride
            setCurrentRide(response.data.ride);
            setNewRide(null);
            setRideStatus(RideStatus.ACCEPTED);
        } catch (error) {
            console.error('Error accepting ride:', error);
        }
    };

    return (
        <div className="h-screen bg-white relative">
            {rideStatus === RideStatus.IDLE && !newRide && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-lg font-medium">Waiting for rides...</p>
                </div>
            )}
            {newRide && rideStatus === RideStatus.IDLE && (
                <RideRequestPanel
                    ride={newRide}
                    onAccept={() => handleAcceptRide(newRide._id)}
                    onReject={() => setNewRide(null)}
                />
            )}
            {rideStatus === RideStatus.ACCEPTED && (
                <AcceptedRidePanel
                    ride={currentRide}
                    onArrived={() => setRideStatus(RideStatus.ARRIVED)}
                />
            )}
            {rideStatus === RideStatus.ARRIVED && (
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl">
                    <p className="text-center text-gray-500 font-medium">Ask rider for OTP to start the ride</p>
                </div>
            )}

        </div>
    );
}

export default DriverHome;
