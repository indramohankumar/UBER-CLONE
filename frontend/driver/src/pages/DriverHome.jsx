import React, { useState, useContext, useEffect } from 'react';
import DriverAuthContext from '../context/DriverAuthContext';
import api from '../services/api';
import socket from '../services/socket';
import RideRequestPanel from '../componenets/RideRequestPanel';
import AcceptedRidePanel from '../componenets/AcceptedRidePanel';
import OTPPanel from '../componenets/otppannel';
import RideInProgressPanel from '../componenets/RideInProgressPanel';
import RideCompletedPanel from '../componenets/RideCompletedPanel';
import toast from 'react-hot-toast';
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
            toast.success("Ride accepted!");
        } catch (error) {
            toast.error(
              error.response?.data?.message ||
                'Failed to accept the ride. Please try again.'
            );
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
        toast.success("Ride started!");
      }catch(error){
        toast.error(
          error.response?.data?.message ||
            'Failed to start the ride. Please try again.'
        );
      }
    }
    const handleArrived=async()=>{
      try{
        const response=await api.patch(
          `/rides/${currentRide._id}/arrive`
        );
        setCurrentRide(response.data.data);
        setRideStatus(RideStatus.ARRIVED);
        toast.success("Arrived at pickup location!");
      }catch(error){
        toast.error(
          error.response?.data?.message ||
            'Failed to mark arrival. Please try again.'
        );
      }
    }
    const handleCompleteRide=async()=>{
      try{
        const response=await api.patch(
          `/rides/${currentRide._id}/complete`
        );
        setCurrentRide(response.data.data);
        setRideStatus(RideStatus.COMPLETED);
        toast.success("Ride completed successfully!");
      }
      catch(error){
        toast.error('Error completing ride: ' + (error.response?.data?.message || error.message));
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
                    onArrived={handleArrived}
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
