import express from 'express';
import rideRoutes from './routes/rides';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/rides', rideRoutes);

let port = 8000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});


export default app;
