import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/databaseConfig';


class AuthController {
  constructor() {
    this.fieldErrors = {};
    this.willSave = true;
    this.signUp = this.signUp.bind(this);
  }

  validateUser(fieldData, fieldName) {
    if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        this.fieldErrors[fieldName] = `${fieldName} is required`;
        this.willSave = false;
      }
    } else if (fieldData === undefined) {
      this.fieldErrors[fieldName] = `${fieldName} is required`;
      this.willSave = false;
    } else {
      this.willSave = true;
    }
  }

  signUp(req, res) {
    const {
      username, firstname, lastname, phone, email, password,
    } = req.body;

    this.validateUser(firstname, 'firstname');
    this.validateUser(lastname, 'lastname');
    this.validateUser(username, 'username');
    this.validateUser(phone, 'phone');
    this.validateUser(email, 'email');
    this.validateUser(password, 'password');

    if (this.willSave) {
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
        errors: this.fieldErrors,
      });
    }
  }
}


export default AuthController;
