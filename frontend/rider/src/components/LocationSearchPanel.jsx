import React from 'react';

function LocationSearchPanel({suggestedLocations , onLocationSelect }) {


    return (
        <div className="mt-6">
            {suggestedLocations.map((location, index) => (
                <div
                    key={index}
                    onClick={() => onLocationSelect(location)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        📍
                    </div>

  <p className="font-medium">
                        {location}
                    </p>
 </div>
            ))}
        </div>
    );

}

export default LocationSearchPanel;