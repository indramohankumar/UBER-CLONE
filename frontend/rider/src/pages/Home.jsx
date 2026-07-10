import React, { useState, useEffect } from 'react';
import LocationSearchPanel from '../components/LocationSearchPanel';
import api from '../services/api';
function Home() {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);

    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [activeInput, setActiveInput] = useState('');
    const handleLocationSelect = (location) => {
        if (activeInput === 'pickup') {
            setPickup(location);
        } else {
            setDestination(location);
        }
        setPanelOpen(false);
    }

    useEffect(() => {
        const fetchSuggestedLocations = async () => {
 const query =
        activeInput ==="pickup"?pickup:destination;
        if(!query.trim()){
            setSuggestedLocations([]);
            return;
        }
        try {
const {data}=await api.get(`/maps/suggestions?input=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
                
            }
        )
             setSuggestedLocations(data.suggestions);
    }
    catch (error) {
        console.error("Error fetching suggested locations:", error);
    }
};
    
        fetchSuggestedLocations();
       
        
        
   
        
    }, [pickup, destination,activeInput]);

    return (
        <div className="h-screen relative">
            <div className="h-full bg-gray-200">

            </div>

     <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-all duration-300 ${
                    panelOpen ? 'h-[70%]' : 'h-auto'
                }`}
            >
                <h2 className="text-2xl font-semibold">
                    Where to?
        </h2>

      <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        onFocus={() => {
                            setPanelOpen(true);
                            setActiveInput('pickup');
                        }}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3"
                    />
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Where to?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => {
                            setPanelOpen(true);
                            setActiveInput('destination');
                        }}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3"
                    />
                </div>

                <button
                    className="w-full bg-black text-white rounded-lg py-3 mt-6 font-semibold hover:bg-gray-900 transition"
                >
                    Find Ride
                </button>

                {panelOpen && (
                    <LocationSearchPanel
                        suggestedLocations={suggestedLocations}
                        activeInput={activeInput}
                        onLocationSelect={handleLocationSelect}
                    />
                )}
            </div>
        </div>
    );
}

export default Home;