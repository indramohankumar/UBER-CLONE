import React, { useState, useContext, useEffect } from 'react';
import DriverAuthContext from '../context/DriverAuthContext';
import api from '../services/api';
import socket from '../services/socket';
import RideRequestPanel from '../componenets/RideRequestPanel';
import AcceptedRidePanel from '../componenets/AcceptedRidePanel';
import OTPPanel from '../componenets/otppannel';
import RideInProgressPanel from '../componenets/RideInProgressPanel';
import RideCompletedPanel from '../componenets/RideCompletedPanel';
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
        
        const handleConnect = () => {
            socket.emit('join', { id: driver._id, role: 'driver' });
        };
        
        socket.on('connect', handleConnect);
        
        // In case it's already connected when this runs
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
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
            const response = await api.patch(
              `/rides/${rideId}/accept`);
            setCurrentRide(response.data.data);
            setNewRide(null);
            setRideStatus(RideStatus.ACCEPTED);
        } catch (error) {
            console.error('Error accepting ride:', error);
        }
    };

    const handleStartRide=async(otp)=>{
      try{
        const response=await api.patch(
          `/rides/${currentRide._id}/start`,
          {otp}
        );
        setCurrentRide(response.data.data);
        setRideStatus(RideStatus.ONGOING);
      }catch(error){
        console.error('Error starting ride:', error
        )
      }
    }
    const handleCompleteRide=async()=>{
      try{
        const response=await api.patch(
          `/rides/${currentRide._id}/complete`
        );
        setCurrentRide(response.data.data);
        setRideStatus(RideStatus.COMPLETED);
      }
      catch(error){
        console.error('Error completing ride:', error);
      }
    }
    const restDriverState=()=>{
      setCurrentRide(null);
      setNewRide(null);
      setRideStatus(RideStatus.IDLE);

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
                 <OTPPanel
        ride={currentRide}
        onStart={handleStartRide}
    />
            )}
            {rideStatus === RideStatus.ONGOING && (
                <RideInProgressPanel
                    ride={currentRide}
                    onComplete={handleCompleteRide}
                />
            )}
            {rideStatus === RideStatus.COMPLETED && (
                <RideCompletedPanel
                    ride={currentRide}
                    onFinish={restDriverState}
                />
            )}

        </div>
    );
}

export default DriverHome;
