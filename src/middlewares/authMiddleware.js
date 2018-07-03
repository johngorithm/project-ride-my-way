import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
      if (error) {
        res.status(403).json({
          message: 'Failed to authenticate token',
          status: false,
          error: 'Token is Invalid or does not exist',
        });
      } else if (decode) {
        req.decode = decode;
        next();
      }
    });
  } else {
    res.status(403).json({
      message: 'Failed to authenticate token',
      status: false,
      error: 'Token is Invalid or does not exist',
    });
  }
};

export default verifyToken;
