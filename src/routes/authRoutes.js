import express from 'express';
import AuthController from '../controllers/authControllers';
import ValidateInput from '../helpers/inputValidator';


const authRouter = express.Router();

authRouter.post('/signup', ValidateInput.validateUser, AuthController.signUp);
authRouter.post('/login', ValidateInput.validateUser, AuthController.logIn);

export default authRouter;
