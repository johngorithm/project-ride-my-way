import express from 'express';
// import rideRoutes from './routes/rides';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/rides/:rideId', routeGetSingleRide);
// app.use('/api/v1/rides', rideRoutes);


app.listen(8000, () => {
  console.log('Server started at port: 5000');
});


export default app;
