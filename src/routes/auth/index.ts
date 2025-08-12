import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';

import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware';
import { generateUser } from '../utils';

export const router = Router();
const prisma = new PrismaClient();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// 로그인
router.post('/login', async (req, res) => {
  const body: LoginBody = req.body;
  const { userId, password } = body;

  if (!userId || !password) {
    return res.status(400).send({ message: 'userId and password are required' });
  }

  const response = await prisma.user.findUnique({ where: { user_id: userId, password } });

  if (!response) {
    return res.status(401).send({ message: 'Not found user. check userId and password.' });
  }

  const token = jwt.sign({ payload: userId }, jwtSecretKey || '', { expiresIn: '30m' });

  const user = generateUser(response);

  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 1000 * 30, sameSite: 'lax' });
  res.send({ result: user });
});

// 로그아웃
router.post('/logout', verifyToken, async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', path: '/', secure: false });
  res.send({ result: 'logout Success' });
});

// 확인
router.get('/me', verifyToken, async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  const decoded = jwt.verify(token, jwtSecretKey || '') as { payload: string };
  const userId = decoded.payload;

  const response = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!response) {
    return res.status(404).send({ result: 'User not found' });
  }

  const user: User = generateUser(response);
  const responseBody: ApiResponse<User> = {
    result: user,
  };

  res.send(responseBody);
});
