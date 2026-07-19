import React from 'react'
import { useState } from 'react'
function OTPPanel({ride, onStart}) {
    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if(!otp.trim()){
            setErrorMsg('Please enter the OTP');
            return;
        }
        
        try {
            await onStart(otp);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Invalid OTP');
        }
    };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl">

        <div className="mb-6">
        <h2 className="text-lg font-bold text-neutral-900">verify Ride</h2>
        <p className="text-gray-500 text-sm mt-1">Ask the rider for the otp before starting the ride</p>
</div>  

{errorMsg && (
    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
        {errorMsg}
    </div>
)}

<div className="bg-gray-50 rounded-xl p-4 mb-5">
    <div className="mb-3">
        <p className="text-xs text-gray-400 font-medium mb-1">PICKUP</p>
        <p className="text-sm font-semibold text-gray-800">{ride.pickup}</p>
    </div>
    <div>
        <p className="text-xs text-gray-400 font-medium mb-1">DESTINATION</p>
        <p className="text-sm font-semibold text-gray-800">{ride.destination}</p>
    </div>
</div>

<form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
                />
                 <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900"
                >
                    Start Ride
                </button>

            </form>

        </div>
  )
}

export default OTPPanel
