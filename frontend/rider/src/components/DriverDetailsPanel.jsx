import React from 'react';

function DriverDetailsPanel({ ride }) {
    if (!ride || !ride.driver) return null;

    const { driver, otp } = ride;

    return (
        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] absolute bottom-0 left-0 right-0 z-50">
            <h2 className="text-2xl font-bold text-center mb-6 border-b pb-4">Meet your driver</h2>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
       <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-2xl">
                        👤
                    </div>
            <div>
                        <p className="font-bold text-lg capitalize">{driver.fullname?.firstname} {driver.fullname?.lastname}</p>
                        <p className="text-sm text-gray-500 font-medium">★ 4.9 Rating</p>
                    </div>
                </div>
                
                <div className="text-right bg-gray-100 p-3 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold uppercase">{driver.vehicle?.color} {driver.vehicle?.vehicleType}</p>
                    <p className="font-bold text-xl uppercase tracking-wider">{driver.vehicle?.plate}</p>
                </div>
            </div>

            <div className="flex justify-between items-center bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 mb-6">
           <div className="flex flex-col">
                    <span className="text-sm font-semibold uppercase tracking-wide">Provide this PIN</span>
                    <span className="text-xs">to start your ride</span>
                </div>
                <div className="font-bold text-3xl tracking-widest">{otp}</div>
            </div>

            <button className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-900 transition mb-2">
                Contact Driver
            </button>
            <button className="w-full bg-red-100 text-red-600 rounded-lg py-3 font-semibold hover:bg-red-200 transition">
                Cancel Ride
            </button>
        </div>
    );
}

export default DriverDetailsPanel;
