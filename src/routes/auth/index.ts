import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';

import jwt from 'jsonwebtoken';

export const router = Router();
const prisma = new PrismaClient();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// 로그인
router.post('/login', async (req, res) => {
  const body: LoginBody = req.body;
  const { userId, password } = body;

  const response = await prisma.user.findUnique({ where: { user_id: userId, password: password } });

  if (!response) {
    return res.status(404).send({ message: 'Not found user. check userId and password.' });
  }

  const token = jwt.sign({ payload: userId }, jwtSecretKey || '', { expiresIn: '10s' });

  res.cookie('token', token, { httpOnly: true, maxAge: 10 * 1000, sameSite: 'lax' });
  res.send({ token });
});

// 로그아웃
router.post('/logout', (req, res) => {});
