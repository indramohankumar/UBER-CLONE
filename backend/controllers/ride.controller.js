const rideService=require('../services/ride.service');
const createRide=async(req,res)=>{
    try{
        const {
            pickupLocation,
            dropoffLocation
        }=req.body;
        const rider=req.user._id;
        const Ride=await rideService.createRide({
            rider,
            pickupLocation:pickupLocation,
            dropoffLocation:dropoffLocation
        });
        res.status(201).json({
            success:true,
            message:"Ride created successfully",
            data:Ride
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
        }
    };

const getPendingRides = async (req, res) => {
    try{
        const pendingRides =await rideService.getPendingRides();
    res.status(200).json({
        success:true,
        message:"Pending rides fetched successfully",
        data:pendingRides
    }
    );
    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    
}
};
const acceptRide=async(req,res)=>{
    try{
        const {rideId}=req.params;
        const driverId=req.driver._id;
        const ride=await rideService.acceptRide(rideId,driverId);
        res.status(200).json({
            success:true,    
            message:"Ride accepted successfully",
            data:ride
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
        };
    const startRide=async(req,res)=>{
        try{
            const {rideId}=req.params;
            const {otp}=req.body;
            const driverId=req.driver._id;
            const ride=await rideService.startRide(rideId,driverId,otp);
            res.status(200).json({
                success:true,
                message:"Ride started successfully",
                data:ride
            });
        }catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            });
        }
        
    };
    const completeRide=async(req,res)=>{
        try{
            const {rideId}=req.params;
            const driverId=req.driver._id;
            const ride=await rideService.completeRide(rideId,driverId);
            res.status(200).json({
                success:true,
                message:"Ride completed successfully",
                data:ride
            });
        }
        catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            });
        }

    }

    const getFareEstimate = async (req, res) => {
        try {
            const { pickup, destination } = req.query;
            if (!pickup || !destination) {
                return res.status(400).json({
                    success: false,
                    message: "Pickup and destination are required"
                });
            }
            const fareData = await rideService.getFareEstimate(pickup, destination);
            res.status(200).json({
                success: true,
                data: fareData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
const arriveAtPickup=async(req,res)=>{
    try{
        const {rideId}=req.params;
        const driverId=req.driver._id;
        const ride=await rideService.arriveAtPickup(
rideId,driverId);
        res.status(200).json({
            success:true,
            message:"Driver arrived at pickup location",
            data:ride
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

    module.exports={
        createRide,
        getPendingRides,
        acceptRide,
        startRide,
        completeRide,
        getFareEstimate,
        arriveAtPickup
};