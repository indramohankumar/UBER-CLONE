const Driver = require("../models/drivermodel");
const redisClient = require("../config/redis");

const updateDriverLocation = async (driverId, latitude, longitude) => {
    if (!driverId || latitude == null || longitude == null) {
        throw new Error("Missing required parameters");
    }

    await redisClient.geoAdd("drivers", {
        longitude,
        latitude,
        member: driverId.toString()
    });

    return true;
};

const findNearbyDrivers = async (latitude, longitude, radius) => {

    if (latitude == null || longitude == null || radius == null) {
        throw new Error("Missing required parameters");
    }

    const nearbyDriverIds = await redisClient.geoSearch(
        "drivers",
        {
            longitude,
            latitude
        },
        {
            radius,
            unit: "m"
        }
    );

    const mongoose = require('mongoose');
    const validDriverIds = nearbyDriverIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validDriverIds.length === 0) {
        return [];
    }

    const nearbyDrivers = await Driver.find({
        _id: { $in: validDriverIds }
    });

    return nearbyDrivers;
};

module.exports = {
    updateDriverLocation,
    findNearbyDrivers
};