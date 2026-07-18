import React from "react";

function RideRequestPanel({ ride, onAccept, onReject }) {
    if (!ride) return null;

    return (
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900">New Ride Request</h2>
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Live
                </span>
            </div>

            <div className="space-y-4">
                <div className="rounded-xl bg-neutral-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Pickup</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{ride.pickup}</p>
                </div>

                <div className="rounded-xl bg-neutral-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Destination</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{ride.destination}</p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3">
                    <p className="text-sm font-semibold text-neutral-600">Estimated Fare</p>
                    <p className="text-xl font-extrabold text-neutral-900">Rs {ride.fare}</p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                    onClick={onReject}
                    className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                    Reject
                </button>

                <button
                    onClick={onAccept}
                    className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                    Accept Ride
                </button>
            </div>
        </div>
    );
}

export default RideRequestPanel;