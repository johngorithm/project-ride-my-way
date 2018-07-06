import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const token = `${jwt.sign({
  id: 1,
  username: 'johnny9334',
  firstname: 'John',
}, process.env.SECRET_KEY, { expiresIn: '24h' })}`;

export default token;
