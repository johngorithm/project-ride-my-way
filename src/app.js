import express from 'express';
import rideRoutes from './routes/rideRoutes';
import indexRoute from './routes/indexRoute';
import authRoute from './routes/authRoute';
import userRoutes from './routes/userRoutes';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(`${__dirname}/../public`));


app.use('/', indexRoute);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});


export default app;
