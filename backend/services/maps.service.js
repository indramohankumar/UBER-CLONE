
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
    const response=await axios.post(`https://api.openrouteservice.org/v2/directions/driving-car`,
         {
            coordinates:[
                [
                    pickupCoordinates.longitude,
                    pickupCoordinates.latitude
                ],
                [
                    dropoffCoordinates.longitude,
                    dropoffCoordinates.latitude
                ]
            ]
        },
        {
            headers:{
                Authorization: process.env.ORS_API_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
    const route = response.data.routes[0];
    const distance = route.summary.distance;
const duration = route.summary.duration;
const distanceInKm = distance / 1000;
const durationInMinutes= duration / 60;
return {
    distance: distanceInKm,
    duration: durationInMinutes

};
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