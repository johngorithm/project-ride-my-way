import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/databaseConfig';
import AuthController from '../controllers/authController';


const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signUp);

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  const fieldErrors = {};
  let isDataValid = true;

  const validateUser = (fieldData, fieldName) => {
    if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        fieldErrors[fieldName] = `${fieldName} is required`;
        isDataValid = false;
      }
    } else if (fieldData === undefined) {
      fieldErrors[fieldName] = `${fieldName} is required`;
      isDataValid = false;
    }
  };

  validateUser(username, 'username');
  validateUser(password, 'password');

  if (isDataValid) {
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, user data retrieval was not successful!',
          status: false,
          user: req.body,
          error: error.message,
        });
      } else if (user.rows[0]) {
        if (bcrypt.compareSync(password, user.rows[0].password)) {
          const payload = {
            user_id: user.rows[0].user_id,
            username: user.rows[0].username,
            firstname: user.rows[0].firstname,
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10 h' });
          res.append('x-access-token', token).status(200).json({
            message: `Welcome ${user.rows[0].firstname}, you are successfully logged in`,
            status: true,
            user: user.rows[0],
          });
        } else {
          res.status(400).json({
            message: `${user.rows[0].firstname}, your password is incorrect, please check and try again`,
            status: false,
            user: req.body,
          });
        }
      } else {
        res.status(404).json({
          message: `${username} does not exist, please check and try again`,
          status: false,
          error: 'User Not Found!',
        });
      }
    });
  } else {
    res.status(400).json({
      message: 'The data you entered is invalid',
      status: false,
      error: 'Invalid Data Submitted!',
    });
  }
});

export default authRouter;
