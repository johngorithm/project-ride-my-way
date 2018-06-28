import express from 'express';
import rideRoutes from './routes/rideRoutes';
import indexRoute from './routes/indexRoute';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(`${__dirname}/../public`));


app.use('/', indexRoute);
app.use('/api/v1/rides', rideRoutes);


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});


export default app;
