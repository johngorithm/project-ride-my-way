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
      } else if (fieldData.trim().length > 0) {
        if (fieldName === 'password' && fieldData.length < 6) {
          fieldErrors[fieldName] = 'password must not be less than 6 characters';
          willSave = false;
        } else if (fieldName === 'email') {
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(fieldData)) {
            fieldErrors[fieldName] = 'email address is invalid';
            willSave = false;
          }
        }
      }
    } else if (fieldData === undefined) {
      fieldErrors[fieldName] = `${fieldName} is required`;
      willSave = false;
    } else {
      fieldErrors[fieldName] = `${fieldName} contains invalid data`;
      willSave = false;
    }
  };

  validateUser(firstname, 'firstname');
  validateUser(lastname, 'lastname');
  validateUser(username, 'username');
  validateUser(email, 'email');
  validateUser(password, 'password');

  if (willSave) {
    const hashedPassword = bcrypt.hashSync(password.toString(), 10);
    const query = 'INSERT INTO users ( firstname, lastname, username, email, password ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING firstname, username, user_id';
    const values = [firstname, lastname, username, email, hashedPassword];

    pool.query(query, values, (error, addedUser) => {
      if (error) {
        if (error.code === '23505') {
          res.status(500).json({
            message: 'This user already exist in our database, Please login instead',
            status: false,
            user: req.body,
            error: error.message,
          });
        } else if (error.code === '22001') {
          res.status(500).json({
            message: 'Ooops!, You just exceeded the maximum number of characters allowed for this field.',
            status: false,
            user: req.body,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Ooops!, Something went wrong, user could not be saved.',
            status: false,
            user: req.body,
            error: error.message,
          });
        }
      } else if (addedUser.rows[0]) {
        const payload = {
          username: addedUser.rows[0].username,
          firstname: addedUser.rows[0].firstname,
          user_id: addedUser.rows[0].user_id,
        };

        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' }, (tokenError, userToken) => {
          if (tokenError) {
            res.status(500).json({
              message: 'Sorry we are unable to generate a token, please try again or login with your credentials',
              status: false,
              error: 'Unable To Generate Token',
            });
            return;
          }
          res.status(200).json({
            message: `Welcome ${payload.firstname}, your account was successfully created`,
            status: true,
            user: payload,
            userToken,
          });
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
          res.status(200).json({
            message: `Welcome ${payload.firstname}, you are successfully logged in`,
            status: true,
            user: payload,
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
