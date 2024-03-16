// import 'dotenv/config';
import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: process.env.EXP_TIME });
}
  
export {
    generateAccessToken,
}