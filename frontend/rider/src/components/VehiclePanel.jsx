import React from 'react';

function VehiclePanel({ fareData }) {
    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-sm text-gray-500">
                    📍 {fareData.distance} km
                </p>
                <p className="text-sm text-gray-500">
                    ⏱️ {fareData.duration} mins
                </p>
            </div>

            
            {fareData.vehicles.map((vehicle, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 cursor-pointer transition"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                            {vehicle.icon}
                        </div>
                        <div>
                            <p className="font-medium">{vehicle.type}</p>
                            <p className="text-sm text-gray-500">{vehicle.eta}</p>
                        </div>
                    </div>
                    <p className="font-semibold">₹{vehicle.fare}</p>
                </div>
            ))}
        </div>
    );
}

export default VehiclePanel;