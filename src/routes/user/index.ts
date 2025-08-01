import { Router } from 'express';

export const router = Router();

const baseUrl = '/user';

router.get(baseUrl, (req, res) => {
  res.send({ user: 'user' });
});
