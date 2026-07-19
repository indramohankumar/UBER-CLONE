import React from 'react'

function RideInProgressPanel({ride, onComplete}) {
    if (!ride) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <div className="text-left">
                <p className="text-xs text-gray-400">RIDER</p>
                <h2 className="text-lg font-bold text-gray-900">
                    {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                </h2>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400">Fare</p>
                <p className="text-lg font-black">&#8377;{ride.fare}</p>
            </div>
        </div>
      
        <div className="bg-gray-100 rounded-xl p-4 mb-5">
            <p className="text-xs text-gray-400 font-medium mb-1">DESTINATION</p>
            <p className="text-sm font-semibold text-gray-800">{ride.destination}</p>
        </div>
        
        <div className="mb-5 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ride in Progress</span>
        </div>
        
        <button
            onClick={onComplete}
            className="w-full bg-black text-white font-semibold py-4 rounded-xl hover:bg-gray-900 transition active:scale-95">
            Complete Ride
        </button>
    </div>


  )
}

export default RideInProgressPanel
