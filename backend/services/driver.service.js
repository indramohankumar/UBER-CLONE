const Driver=require('../models/drivermodel');
const updateDriverLocation = async (driverId, latitude, longitude) => {
    if(!driverId || latitude==null || longitude==null){
        throw new Error("Missing required parameters");
    } 
    const driver= await Driver.findById(driverId);
if(!driver){
    throw new Error("Driver not found");
}
driver.location={
    type:"Point",
    coordinates:[
        longitude,
        latitude
    ]
}
await driver.save();
return driver;

};
const findNearbyDrivers = async(
    latitude,
    longitude,
    radius
) => {
    if(latitude==null || longitude==null || radius==null){
        throw new Error("Missing required parameters");
    }
    const nearbyDrivers=await Driver.find({
        location:{
            $near:{
            $geometry:{
                type:"Point",
                coordinates:
                [longitude,latitude]
            },
            $maxDistance:radius
             }
             }
    });
    return nearbyDrivers;
}


module.exports = {
    updateDriverLocation,
    findNearbyDrivers
};