import express from 'express';
import ValidateInput from '../helpers/inputValidator';
import UserController from '../controllers/userControllers';


const userRouter = express.Router();

userRouter.post('/rides', ValidateInput.validateRide, UserController.createRideOffer);
userRouter.get('/rides/:rideId/requests', UserController.getAllRequestsForSpecificRide);
userRouter.put('/rides/:rideId/requests/:requestId', UserController.acceptOrRejectRideRequest);
// FRONTEND SPECIFIC ROUTES
userRouter.get('/me', UserController.getUserData);
userRouter.get('/rides/offered', UserController.getRidesOfferedByUser);
userRouter.get('/rides/taken', UserController.getRidesTakenByUser);
userRouter.get('/rides/requests', UserController.getRequestsForUser);

export default userRouter;
