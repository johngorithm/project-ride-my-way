import express from 'express';
import pool from '../config/databaseConfig';
import validateInput from '../helpers/inputValidator';
import UserController from '../controllers/userControllers';


const userRouter = express.Router();

userRouter.post('/rides', validateInput, UserController.createRideOffer);
userRouter.get('/rides/:rideId/requests', UserController.getAllRequestsForSpecificRide);
userRouter.put('/rides/:rideId/requests/:requestId', UserController.acceptOrRejectRideRequest);

export default userRouter;
