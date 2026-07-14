
const axios = require('axios');
const getCoordinates = async (address) => {
try{
    const response = await axios.get(`https://api.openrouteservice.org/geocode/search`,
         {
        params:{
            api_key: process.env.ORS_API_KEY,
            text: address
        }
    });
    const features = response.data.features;
    if(!features||features.length === 0){
        throw new Error("No coordinates found for the given address");
    }
    return{
        latitude:features[0].geometry.coordinates[1],
        longitude:features[0].geometry.coordinates[0]
    };
}
catch(error){
    throw new Error("Error fetching coordinates: " + error.message);
    }
}

const getAutoCompleteSuggestions = async (input) => {
    try {
        const response = await axios.get(`https://api.openrouteservice.org/geocode/autocomplete`, {
            params: {
                api_key: process.env.ORS_API_KEY,
                text: input
            }
        });
        const features = response.data.features;
        if (!features) return [];
        return features.map(feature => feature.properties.label || feature.properties.name);
    } catch (error) {
        throw new Error("Error fetching suggestions: " + error.message);
    }
};

const getDistanceAndTime = async (origin, destination) => {
    const pickupCoordinates = await getCoordinates(origin);
    const dropoffCoordinates = await getCoordinates(destination);
    try {
        const response = await axios.get(
            `http://router.project-osrm.org/route/v1/driving/${pickupCoordinates.longitude},${pickupCoordinates.latitude};${dropoffCoordinates.longitude},${dropoffCoordinates.latitude}`,
            {
                params: {
                    overview: 'full',
                    geometries: 'polyline'
                },
                timeout: 15000
            }
        );
        
        if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
            throw new Error("No route found between these locations.");
        }
        
        const route = response.data.routes[0];
        const distanceInKm = route.distance / 1000;
        const durationInMinutes = route.duration / 60;
        
        return {
            distance: distanceInKm,
            duration: durationInMinutes,
            pickupCoordinates,
            dropoffCoordinates,
            routeGeometry: route.geometry
        };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error("Route calculation timed out. Please try again.");
        }
        throw new Error(error.response?.data?.message || "Unable to calculate route and fare.");
    }
};
const calculateFare = (distance, duration) => {
    const BASE_FARE=40;
    const DISTANCE_RATE=10;
    const TIME_RATE=2;
    const fare=BASE_FARE +
    (distance * DISTANCE_RATE) +
    (duration * TIME_RATE);
    return Math.round(fare);


};

module.exports = {
    getCoordinates,
    getDistanceAndTime,
    calculateFare,
    getAutoCompleteSuggestions
};