const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
{
    rider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Driver"
    },

    pickup:{
        type:String,
        required:true
    },

    destination:{
        type:String,
        required:true
    },

    fare:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:[
            "requested",
            "accepted",
            "arrived",
            "ongoing",
            "completed",
            "cancelled"
        ],
        default:"requested"
    },

    otp:{
        type:String,
        select:false
    }

},{
    timestamps:true
});
const Ride=mongoose.model("Ride",rideSchema);
module.exports=Ride;