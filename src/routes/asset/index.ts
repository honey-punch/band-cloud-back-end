import { Router } from 'express';

export const router = Router();

const baseUrl = '/asset';

router.get(baseUrl, (req, res) => {
  res.send({ asset: 'asset' });
})

