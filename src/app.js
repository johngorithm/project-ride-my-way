import express from 'express';
import dotenv from 'dotenv';
import rideRoutes from './routes/rideRoutes';
import indexRoute from './routes/indexRoute';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import verifyToken from './middlewares/authMiddleware';

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(`${__dirname}/../public`));


app.use('/', indexRoute);
app.use('/api/v1/rides', verifyToken, rideRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', verifyToken, userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});


export default app;
