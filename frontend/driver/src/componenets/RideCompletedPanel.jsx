import React from 'react';

function RideCompletedPanel({ ride, onFinish }) {

    if (!ride) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl">

            <div className="flex flex-col items-center mb-6">

                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-4xl">✓</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                    Ride Completed
                </h2>

                <p className="text-gray-500 mt-2">
                    Great job! Your ride has been completed successfully.
                </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-5 mb-6">

                <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Rider</span>
                    <span className="font-semibold">
                        {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                    </span>
                </div>

                <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Destination</span>
                    <span className="font-semibold">
                        {ride.destination}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">Earnings</span>
                    <span className="font-bold text-lg">
                        ₹{ride.fare}
                    </span>
                </div>

            </div>

            <button
                onClick={onFinish}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition"
            >
                Back to Waiting
            </button>

        </div>
    );
}

export default RideCompletedPanel;