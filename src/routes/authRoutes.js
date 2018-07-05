import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/databaseConfig';


const authRouter = express.Router();

authRouter.post('/signup', (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    password,
  } = req.body;

  let willSave = true;
  const fieldErrors = {};

  const validateUser = (fieldData, fieldName) => {
    if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        fieldErrors[fieldName] = `${fieldName} is required`;
        willSave = false;
      }
    } else if (fieldData === undefined) {
      fieldErrors[fieldName] = `${fieldName} is required`;
      willSave = false;
    }
  };

  validateUser(firstname, 'firstname');
  validateUser(lastname, 'lastname');
  validateUser(username, 'username');
  validateUser(email, 'email');
  validateUser(password, 'password');

  if (willSave) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users ( firstname, lastname, username, email, password ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING firstname, username';
    const values = [firstname, lastname, username, email, hashedPassword];

    pool.query(query, values, (error, addedUser) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Ride could not be saved!',
          status: false,
          user: req.body,
          error: error.message,
        });
      } else if (addedUser.rows[0]) {
        const payload = {
          user_id: addedUser.rows[0].user_id,
          username: addedUser.rows[0].username,
          firstname: addedUser.rows[0].firstname,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10 h' });
        res.status(200).json({
          message: `Welcome ${payload.firstname}, your account was successfully created`,
          status: true,
          user: payload,
          token,
        });
      }
    });
  } else {
    res.status(400).json({
      message: 'Required field(s) is/are missing',
      status: false,
      user: req.body,
      errors: fieldErrors,
    });
  }
});


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
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
          const authenticatedUser = {
            id: user.rows[0].user_id,
            username: user.rows[0].username,
            firstname: user.rows[0].firstname,
          };
          res.status(200).json({
            message: `Welcome ${authenticatedUser.firstname}, you are successfully logged in`,
            status: true,
            user: authenticatedUser,
            token,
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
