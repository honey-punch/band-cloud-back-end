import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });
const jwtSecretKey = process.env.JWT_SECRET_KEY;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ result: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey || '');
    console.log('decoded is', decoded);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ result: 'Invalid token' });
  }
}
