const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const driverSchema = new mongoose.Schema(
    {
        "fullname": {
            firstname:{
                type:String,
                required:true,
                minlength:3,
                trim:true       
            },
            lastname:{
                type:String,
                trim:true
            }
        },
        "email":{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },

        "password":{
            type:String,
            required:true,
            minlength:6,
            select:false
        },
       location: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    }
},
            
        "vehicle":{
            "color":{
                type:String,
                required:true,
            },
            "plateNumber":{
                type:String,
                required:true,
            },
            "model":{
                type:String,
                required:true,
            },
            "capacity":{
                type:Number,
                required:true,
            }
        },
      
        "role":{
            type:String,
            enum:["driver"],
            default:"driver"
        }
    },
    {
        timestamps:true
    }
);
driverSchema.index({ location: "2dsphere" });
driverSchema.methods.generateAuthToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            role:this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    );
};
driverSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
};
driverSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
};
const Driver=mongoose.model("Driver",driverSchema);
module.exports=Driver;
    
    