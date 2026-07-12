const Ride=require('../models/ridemodel');
const {getIO,getSocketId}=require('../socket');
const mapsService=require('./maps.service');
const driverService=require('./driver.service');
const createRide=async({
    rider,
    pickupLocation,
    dropoffLocation
})=>{
    if(!pickupLocation || !dropoffLocation){
        throw new Error("Please provide pickup and dropoff locations");
    }
    const {distance,duration}=
    await mapsService.getDistanceAndTime(pickupLocation,dropoffLocation);
    const fare=mapsService.calculateFare(distance,duration);
    const otp=Math.floor(1000+Math.random()*9000).toString();
    const pickupCoordinates = await mapsService.getCoordinates(pickupLocation);
    const newRide=await Ride.create({
        rider,
        pickup: pickupLocation,
        destination: dropoffLocation,
        fare,
        otp
    });
    const nearbyDrivers=await driverService.findNearbyDrivers(
        
        pickupCoordinates.latitude,
        pickupCoordinates.longitude,
        5000
        
    );
     const rideData=newRide.toObject();
         delete rideData.otp;
       const io=getIO();
    for(const driver of nearbyDrivers){
        const socketId=getSocketId(driver._id.toString());
        if(socketId){
        
            io.to(socketId).emit("new-ride",rideData);

    }
}
    return newRide;

};
const getPendingRides=async()=>{
    const pendingRides=await Ride.find({status:"requested"});
    return pendingRides;
}

const acceptRide=async(rideId,driverId)=>{
    const ride=await Ride.findById(rideId);
    if(!ride){
        throw new Error("Ride not found");
    }
    if(ride.status!=="requested"){
        throw new Error("Ride is not available for acceptance");
    }
    ride.driver=driverId;
    ride.status="accepted";
    await ride.save();
    const io=getIO();
    const riderSocketId=getSocketId(ride.rider.toString(),
    "user" );
    if(riderSocketId){
        io.to(riderSocketId).emit("ride-accepted",{
            rideId:ride._id,
            status:ride.status,
            driverId:ride.driver.toString()

        });
        
    }

    
    return ride;
}
const startRide=async(rideId,driverId,otp)=>{
    if(!rideId||!driverId||!otp){
        throw new Error("missing required parameters");
    }
     const ride=await Ride.findById(rideId).select('+otp');
     if(!ride){
        throw new Error("Ride not found");
    }
    if(!ride.driver || !ride.driver.equals(driverId)){
        throw new Error("You are not authorized to start this ride");
    }
    if(ride.status!=="accepted"){
        throw new Error("Ride is not in accepted state");
    }
    if(ride.otp!==otp){
        throw new Error("Invalid OTP");
    }
    
    ride.status="ongoing";
    await ride.save();
    const io=getIO();
    const riderSocketId=getSocketId
    (ride.rider.toString(),"user");
    if(riderSocketId){
        io.to(riderSocketId).emit("ride-started",{
            rideId:ride._id,
            status:ride.status
        })
    }
    ride.otp=undefined;
    return ride;
}
const completeRide=async(rideId,driverId)=>{
    if(!rideId||!driverId){
        throw new Error("missing required parameters");
    }
    const ride=await Ride.findById(rideId);
    if(!ride){
        throw new Error("Ride not found");
    }
    if(!ride.driver || !ride.driver.equals(driverId)){
        throw new Error("You are not authorized to complete this ride");
    }
    if(ride.status!=="ongoing"){
        throw new Error("Ride is not in ongoing state");
    }
    ride.status="completed";
    await ride.save();
    const io=getIO();
    const riderSocketId=getSocketId(ride.rider.toString(),"user");
    if(riderSocketId){
        io.to(riderSocketId).emit("ride-completed",{
            rideId:ride._id,
            status:ride.status
        })
    }
    return ride;
}
const getFareEstimate = async (pickupLocation, dropoffLocation) => {
    if (!pickupLocation || !dropoffLocation) {
        throw new Error("Please provide pickup and dropoff locations");
    }
    const { distance, duration } = await mapsService.getDistanceAndTime(pickupLocation, dropoffLocation);
    const baseFare = mapsService.calculateFare(distance, duration);

    
    const vehicles = [
        {
            type: 'UberGo',
            fare: Math.round(baseFare),
            eta: '2 mins',
            icon: '🚗'
        },
        {
            type: 'Sedan',
            fare: Math.round(baseFare * 1.3),
            eta: '3 mins',
            icon: '🚘'
        },
        {
            type: 'SUV',
            fare: Math.round(baseFare * 1.8),
            eta: '5 mins',
            icon: '🚙'
        }
    ];

    return {
        vehicles,
        distance: parseFloat(distance.toFixed(2)),
        duration: parseFloat(duration.toFixed(2))
    };
};


module.exports={
    createRide,
    getPendingRides,
    acceptRide,
    startRide,
    completeRide,
    getFareEstimate
};