import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';

import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export const router = Router();
const prisma = new PrismaClient();

const storagePath = process.env.STORAGE_PATH || '';
const thumbnailPath = process.env.THUMBNAIL_PATH || '';
const avatarPath = process.env.AVATAR_PATH || '';

const ALLOW_AUDIO_TYPE = ['audio/mpeg', 'audio/wav'];
const ALLOW_IMAGE_TYPE = ['image/png', 'image/jpeg'];

// 오디오
router.get('/audio/:id', async (req, res) => {
  const { id } = req.params;

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    return res.status(404).send({ result: 'Not found. Check id.' });
  }

  const absoluteFilePath = path.join(storagePath, asset.asset_path);

  if (!fs.existsSync(absoluteFilePath)) {
    return res.status(404).json({ error: 'Audio file not found on disk' });
  }

  const mimeType = mime.lookup(absoluteFilePath);

  if (!mimeType || !ALLOW_AUDIO_TYPE.includes(mimeType)) {
    return res.status(400).send('Unsupported audio file type');
  }

  res.setHeader('Content-Type', mimeType);
  res.sendFile(absoluteFilePath);
});

// 썸네일
router.get('/thumbnail/:id', async (req, res) => {
  const { id } = req.params;

  const asset = await prisma.asset.findUnique({ where: { id } });

  const absoluteFilePath = path.join(storagePath, asset?.thumbnail_path || '/');

  if (!asset || !asset.thumbnail_path || !fs.existsSync(absoluteFilePath)) {
    const defaultFilePath = path.join(storagePath, thumbnailPath, '/default-thumbnail.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(defaultFilePath);
    return;
  }

  const mimeType = mime.lookup(absoluteFilePath) || '';

  if (!mimeType || !ALLOW_IMAGE_TYPE.includes(mimeType)) {
    const defaultFilePath = path.join(storagePath, thumbnailPath, '/default-thumbnail.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(defaultFilePath);
    return;
  }

  res.setHeader('Content-Type', mimeType);
  res.sendFile(absoluteFilePath);
});

// 아바타
router.get('/avatar/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  const absoluteFilePath = path.join(storagePath, user?.avatar_path || '/');

  if (!user || !user.avatar_path || !fs.existsSync(absoluteFilePath)) {
    const defaultFilePath = path.join(storagePath, avatarPath, '/default-avatar.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(defaultFilePath);
    return;
  }

  const mimeType = mime.lookup(absoluteFilePath) || '';

  if (!mimeType || !ALLOW_IMAGE_TYPE.includes(mimeType)) {
    const defaultFilePath = path.join(storagePath, avatarPath, '/default-avatar.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(defaultFilePath);
    return;
  }

  res.setHeader('Content-Type', mimeType);
  res.sendFile(absoluteFilePath);
});
