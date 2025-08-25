import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateBand } from '../utils';

export const router = Router();
const prisma = new PrismaClient();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const response = await prisma.band.findUnique({ where: { id } });

  if (!response) {
    return res.status(404).send({ result: 'Not found. Check id.' });
  }

  const band: Band = generateBand(response);
  const responseBody: ApiResponse<Band> = {
    result: band,
  };

  res.send(responseBody);
});
