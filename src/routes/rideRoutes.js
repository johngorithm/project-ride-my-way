import express from 'express';
import RideController from '../controllers/rideControllers';

const rideRoutes = express.Router();

rideRoutes.get('/', RideController.getAllRides);
rideRoutes.get('/:rideId', RideController.getSingleRide);
rideRoutes.post('/:rideId/requests', RideController.postRideRequest);


export default rideRoutes;
