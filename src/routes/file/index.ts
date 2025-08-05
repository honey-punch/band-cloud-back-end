import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';

import path from 'path';
import fs from 'fs';

export const router = Router();
const prisma = new PrismaClient();

const storagePath = process.env.STORAGE_PATH || '';

// 오디오
router.get('/audio/:id', async (req, res) => {
  const { id } = req.params;

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    return res.status(404).send({ message: 'Not found. Check id.' });
  }

  const absoluteFilePath = path.join(storagePath, asset.path);
  console.log(storagePath);
  console.log(absoluteFilePath);

  if (!fs.existsSync(absoluteFilePath)) {
    return res.status(404).json({ error: 'File not found on disk' });
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(absoluteFilePath);
});
