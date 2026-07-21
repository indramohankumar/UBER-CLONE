const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const driverAuthMiddleware = require("../middlewares/driverauthmiddleware");

const rideController = require("../controllers/ride.controller");

router.post(
    "/create",
    authMiddleware,
    rideController.createRide
);

router.get(
    "/pending",
    driverAuthMiddleware,
    rideController.getPendingRides
);
router.patch(
    '/:rideId/accept',
    driverAuthMiddleware,
    rideController.acceptRide
);
router.patch(
    '/:rideId/start',
    driverAuthMiddleware,
    rideController.startRide
);
router.patch(
    '/:rideId/complete',
    driverAuthMiddleware,
    rideController.completeRide
);

router.get(
    '/get-fare',
    authMiddleware,
    rideController.getFareEstimate
);
router.patch(
    '/:rideId/arrive',
    driverAuthMiddleware,
    rideController.arriveAtPickup
);

module.exports = router;