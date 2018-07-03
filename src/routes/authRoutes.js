import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/databaseConfig';

const authRouter = express.Router();

authRouter.post('/signup', (req, res) => {
  const {
    username,
    firstname,
    lastname,
    phone,
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
  validateUser(phone, 'phone');
  validateUser(email, 'email');
  validateUser(password, 'password');

  if (willSave) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users ( firstname, lastname, username, phone, email, password ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING firstname, username, phone';
    const values = [firstname, lastname, username, phone, email, hashedPassword];

    pool.query(query, values, (error, addedUser) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Ride could not be saved!',
          status: false,
          user: req.body,
          error: error.message,
        });
      } else if (addedUser.rows[0]) {
        res.status(200).json({
          message: `Welcome ${addedUser.rows[0].firstname}, your account was successfully created`,
          status: true,
          user: addedUser.rows[0],
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


export default authRouter;
