import React from 'react';

function ConfirmRidePanel({ vehicle, pickup, destination, fareData, onBack, onConfirm }) {
    return (
        <div className="flex flex-col gap-4">

            <div className="flex justify-between items-center mb-2">
                <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
                <h3 className="text-2xl font-bold">Confirm your Ride</h3>
                <div className="w-10"></div> 
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">{vehicle?.icon || '🚗'}</div>
                    <div>
                        <h4 className="font-bold text-xl">{vehicle?.type || 'UberGo'}</h4>
                        <p className="text-gray-500 text-sm">Dropoff in {vehicle?.eta || 'few mins'}</p>
                    </div>
                </div>
                <div className="text-2xl font-bold text-black">
                    ₹{vehicle?.fare || '0'}
                </div>
            </div>

            {/* Location Details */}
            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                <div className="flex items-start gap-4">
                    <div className="mt-1 w-4 h-4 bg-black rounded-full shadow-sm flex-shrink-0"></div>
                    <div className="flex-1 border-b border-gray-200 pb-3">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Pickup</p>
                        <h4 className="font-semibold text-gray-800 leading-tight">{pickup}</h4>
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="mt-1 w-4 h-4 border-[3px] border-black rounded-sm shadow-sm flex-shrink-0"></div>
                    <div className="flex-1">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Dropoff</p>
                        <h4 className="font-semibold text-gray-800 leading-tight">{destination}</h4>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Cash Payment</h4>
                </div>
            </div>
            <button 
                onClick={onConfirm}
                className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl mt-4 hover:bg-gray-800 transition active:scale-[0.98] shadow-lg shadow-gray-300"
            >
                Confirm {vehicle?.type || 'Ride'}
            </button>
        </div>
    );
}

export default ConfirmRidePanel;
