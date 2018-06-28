import express from 'express';

const indexRoute = express.Router();

indexRoute.get('/', (req, res) => {
  res.sendFile('index.html');
});

export default indexRoute;
