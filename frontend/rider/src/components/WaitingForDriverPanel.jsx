import React from 'react';
function WaitingForDriverPanel({ ride, onCancel }) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-center">
                Searching for a driver...
            </h2>

            <p className="text-gray-500 mt-2">
                Please wait while we find the nearest driver.
            </p>

            <div className="mt-8 text-5xl animate-pulse">
                🚗
            </div>

            {ride && (
                <div className="mt-8 text-center">
                    <p>
                        <strong>Pickup:</strong> {ride.pickupLocation}
                    </p>

                    <p>
                        <strong>Destination:</strong> {ride.dropoffLocation}
                    </p>

                    <p>
                        <strong>Status:</strong> {ride.status}
                    </p>
                </div>
            )}
            
            <button onClick={onCancel} className="w-full bg-red-100 text-red-600 rounded-lg py-3 font-semibold hover:bg-red-200 transition mt-8">
                Cancel Ride
            </button>
        </div>
    );
}

export default WaitingForDriverPanel;