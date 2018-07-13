import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const token = `${jwt.sign({
  user_id: 2,
  username: 'deraviv',
  firstname: 'Dera',
}, process.env.SECRET_KEY, { expiresIn: '24h' })}`;

export default token;
