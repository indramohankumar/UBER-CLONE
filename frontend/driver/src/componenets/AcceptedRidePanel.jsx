import React from 'react';

function AcceptedRidePanel({ ride, onArrived, onCancel }) {
    if (!ride) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl">

            
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700">
                    {ride.user?.fullname?.firstname?.[0] || 'R'}
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">RIDER</p>
                    <p className="text-base font-bold text-gray-900">
                        {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                    </p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Fare</p>
                    <p className="text-lg font-black">&#8377;{ride.fare}</p>
                </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 mb-5">
                <div className="mt-1 w-3 h-3 rounded-full bg-green-500 shrink-0"></div>
                <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">NAVIGATING TO PICKUP</p>
                    <p className="text-sm font-semibold text-gray-800">{ride.pickup}</p>
                </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 mb-5">
                <div className="mt-1 w-3 h-3 rounded-full bg-black shrink-0"></div>
                <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">DESTINATION</p>
                    <p className="text-sm font-semibold text-gray-800">{ride.destination}</p>
                </div>
            </div>
            <button
                onClick={onArrived}
                className="w-full bg-black text-white font-semibold py-4 rounded-xl hover:bg-gray-900 transition active:scale-95 mb-3"
            >
                I've Arrived at Pickup
            </button>
            <button
                onClick={onCancel}
                className="w-full bg-red-100 text-red-600 font-semibold py-4 rounded-xl hover:bg-red-200 transition active:scale-95"
            >
                Cancel Ride
            </button>
        </div>
    );
}

export default AcceptedRidePanel;
