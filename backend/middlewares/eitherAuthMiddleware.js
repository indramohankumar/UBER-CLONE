const jwt=require('jsonwebtoken');
const User=require('../models/usermodel');
const Driver=require('../models/drivermodel');
const eitherAuthMiddleware=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success:false,  
                message:"unauthorized access"
            })
        }
        const token=authHeader.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        let user=await User.findById(decoded._id);
        if(user){
            req.user=user;
            return next();
        }
        const driver=await Driver.findById(decoded._id);
        if(driver){
            req.driver=driver;
            return next();
        }
        return res.status(401).json({
            success:false,
            message:"unauthorized access"
        })
    }catch(error){
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"invalid token"
        })
    }
}
module.exports=eitherAuthMiddleware;