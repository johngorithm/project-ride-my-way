import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/databaseConfig';

class AuthController {
  static signUp(req, res) {
    const {
      username,
      firstname,
      lastname,
      email,
      password,
    } = req.body;

    const hashedPassword = bcrypt.hashSync(password.toString(), 10);
    const query = 'INSERT INTO users ( firstname, lastname, username, email, password ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING firstname, username, user_id';
    const values = [firstname, lastname, username, email, hashedPassword];

    pool.query(query, values, (error, addedUser) => {
      if (error) {
        if (error.code === '23505') {
          res.status(403).json({
            message: 'This user already exist in our database, Please login instead',
            status: false,
            data: req.body,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Ooops!, Something went wrong, user could not be saved.',
            status: false,
            data: req.body,
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
              message: 'Your registeration was successful but we are unable to generate a token to Login you in, Please login with your credentials',
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
  }

  static logIn(req, res) {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, user data retrieval was not successful!',
          status: false,
          data: req.body,
          error: error.message,
        });
      } else if (user.rows[0]) {
        if (bcrypt.compareSync(password, user.rows[0].password)) {
          const payload = {
            user_id: user.rows[0].user_id,
            username: user.rows[0].username,
            firstname: user.rows[0].firstname,
          };

          jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' }, (tokenError, token) => {
            if (tokenError) {
              res.status(500).json({
                message: 'Sorry, we are unable to login you in this time, Please try again',
                status: false,
                error: 'Unable To Generate Token',
              });
            } else {
              res.status(200).json({
                message: `Welcome ${payload.firstname}, you are successfully logged in`,
                status: true,
                user: payload,
                token,
              });
            }
          });
        } else {
          res.status(404).json({
            message: `${user.rows[0].firstname}, your password is incorrect, please check and try again`,
            status: false,
            data: req.body,
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
  }
}


export default AuthController;
