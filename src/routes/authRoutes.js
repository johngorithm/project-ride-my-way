import express from 'express';
import validateInput from '../helpers/inputValidator';
import AuthController from '../controllers/authControllers';


const authRouter = express.Router();

authRouter.post('/signup', validateInput, AuthController.signUp);
authRouter.post('/login', validateInput, AuthController.logIn);

export default authRouter;
