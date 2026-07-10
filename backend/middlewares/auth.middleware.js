const jwt=require('jsonwebtoken');
const User=require('../models/usermodel');
const authMiddleware=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                sucess:false,
                message:"unauthorized access"
            })
        }
        const token=authHeader.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found"
            })
        }
        req.user=user;
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"invalid token"
        })
    }
}
module.exports=authMiddleware;