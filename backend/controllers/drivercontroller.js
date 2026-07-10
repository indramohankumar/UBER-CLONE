const Driver = require('../models/drivermodel');
const driverService=require('../services/driver.service');
//Register Driver
const registerDriver=async(req,res)=>{
    try{
        const { fullname, email, password, vehicle, location, role } = req.body;
        if(!fullname || !fullname.firstname || !email || !password || !vehicle || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        const existingDriver=await Driver.findOne({ email });
        if(existingDriver){
            return res.status(400).json({
                success: false,
                message: "Driver already exists"
            });
        }
        // Hash password
        const hashedPassword =await Driver.hashPassword(password);
        // Create driver
        const newDriver=await Driver.create({
            fullname:{
                firstname:fullname.firstname,
                lastname:fullname.lastname
            },
            email,
            password:hashedPassword,
            vehicle,
            location,
            role
        });
        // Generate JWT
        const token=newDriver.generateAuthToken();
        return res.status(201).json({
            success:true,
            message:"Driver registered successfully",
            token,
            driver:newDriver
        });
    }catch(error){  
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};
//Login Driver
const loginDriver=async(req,res)=>{
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide email and password"
            })
        }
        const driver = await Driver.findOne({ email }).select("+password");
        if(!driver){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const isMatch=await driver.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        const token=driver.generateAuthToken();
        return res.status(200).json({
            success:true,
            message:"Driver logged in successfully",
            token,
            driver
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
//get profile
const getDriverProfile=async(req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            driver:req.driver
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }

}
const updateDriverLocation=async(req,res)=>{
    try{
        const {latitude,longitude}=req.body;
        const driverId=req.driver._id;
        const driver=await driverService.updateDriverLocation(
            driverId,
            latitude,
            longitude
        );
        return res.status(200).json({
            success:true,
            message:"driver location updated successfully ",
            data:driver
     } );
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};   
module.exports={registerDriver,loginDriver,getDriverProfile,updateDriverLocation};