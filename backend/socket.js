const {Server} = require('socket.io');
const driverService=require('./services/driver.service');
const Ride=require('./models/ridemodel');
const redisClient=require('./config/redis');
let io;
const initializeSocket=(server)=>{

    io=new Server(server,{
        cors:{
            origin:"*"
        }
    });
    io.on("connection",(socket)=>{
        socket.on("join",async(data)=>{
            const {id,role}=data;
             if(role==="driver"){
                await redisClient.set(`driver:${id}`,socket.id);
                socket.driverId=id;
                console.log("Driver connected",id);
            }
            
            if(role==="user"){
            await redisClient.set(`user:${id}`,socket.id);
                socket.userId=id;
                console.log("User connected",id);
            }
          

        })
          socket.on("location-update",async(data)=>{
            try{
                const {latitude,longitude}=data;
                const driverId=socket.driverId;
                if(!driverId){
                    console.error("Driver ID not found for socket",socket.id);
                    return;
                }
                await driverService.updateDriverLocation(driverId,
                    latitude,longitude);
                const ride=await Ride.findOne({
                    driver:driverId,
                    status:{
                        $in:["accepted","ongoing"]
                    }
                })
                if(!ride){
                    return;
                }
                const riderSocketId= await getSocketId(
                    ride.rider.toString(),
                    "user"
                );
                if(riderSocketId){
                    io.to(riderSocketId).emit(
                        "driver-location-update",
                        {
                            latitude,
                            longitude
                        }
                    )
                }
            } catch(error){
                console.error("Location update error:", error);
            }
        })
      

     console.log("New client connected",socket.id);
       socket.on("disconnect",async () => {

    if (socket.driverId) {
    await redisClient.del(`driver:${socket.driverId}`);

        console.log("Driver disconnected", socket.driverId);
    }
    if (socket.userId) {
        await redisClient.del(`user:${socket.userId}`);
        console.log("User disconnected", socket.userId);
    }

    console.log("Client disconnected", socket.id);
});
    });


};
const getIO=()=>{
    if(!io){
        throw new Error("socket io not initialized");
    }
    return io;

};
const getSocketId=async(id,role)=>{
    if(role==="driver"){
return await redisClient.get(`driver:${id}`);
    }
    if(role==="user"){
        return await redisClient.get(`user:${id}`);
    }
    return null;
    

};
module.exports={initializeSocket,getIO,getSocketId};