import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
      if (error) {
        res.status(403).json({
          message: 'Failed to authenticate token',
          status: false,
          error: 'Invalid Or Expired Token',
        });
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    res.status(403).json({
      message: 'Failed to authenticate token',
      status: false,
      error: 'No Access Token Provided',
    });
  }
};

export default verifyToken;
