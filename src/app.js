import express from 'express';
import rideRoutes from './routes/rides';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(`${__dirname}/public`));

// routes
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.use('/api/v1/rides', rideRoutes);


let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});


export default app;
