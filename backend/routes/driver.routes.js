const express=require('express');
const router=express.Router();
const{
    registerDriver,
    loginDriver,
    getDriverProfile,
    updateDriverLocation
}=require('../controllers/drivercontroller');
const driverAuthMiddleware=require('../middlewares/driverauthmiddleware');
//register driver
router.post('/register',registerDriver);
//login driver
router.post('/login',loginDriver);

//get driver profile
router.get('/profile',driverAuthMiddleware,getDriverProfile);
//driver location update
router.patch("/location",
    driverAuthMiddleware,
    updateDriverLocation
);
module.exports=router;
