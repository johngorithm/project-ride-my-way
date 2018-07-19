import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const token = `${jwt.sign({
  user_id: 2,
  username: 'deraviv',
  firstname: 'Dera',
}, process.env.SECRET_KEY, { expiresIn: '24h' })}`;

const token2 = `${jwt.sign({
  user_id: 4,
  username: 'peace',
  firstname: 'Peace',
}, process.env.SECRET_KEY, { expiresIn: '24h' })}`;

const token3 = `${jwt.sign({
  user_id: 1,
  username: 'johngorithm',
  firstname: 'John',
}, process.env.SECRET_KEY, { expiresIn: '24h' })}`;

export { token, token2, token3 };
