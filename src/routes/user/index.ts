import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateSearchQuery, generateUser } from '../utils';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { verifyToken } from '../middleware';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storagePath = process.env.STORAGE_PATH || '/';
const avatarPath = process.env.AVATAR_PATH || '/';
const tempPath = path.join(storagePath, 'temp');
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}
const upload = multer({ dest: tempPath, limits: { fileSize: MAX_SIZE } });

export const router = Router();
const prisma = new PrismaClient();

// 사용자 리스트
router.get('/search', async (req, res) => {
  const query: SearchQuery = req.query;
  const { where, skip, take, size, page } = generateSearchQuery(query);

  const response = await prisma.user.findMany({ where, skip, take });
  const mappedResponse: User[] = response.map((user) => generateUser(user));

  const totalCount = await prisma.user.count({ where });
  const totalPage = Math.ceil(totalCount / size);
  const currentPage = page;

  const responseBody: ApiResponse<User[]> = {
    result: mappedResponse,
    page: {
      totalCount,
      totalPage,
      currentPage,
      size,
    },
  };

  res.send(responseBody);
});

// 사용자
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const response = await prisma.user.findUnique({ where: { id } });

  if (!response) {
    return res.status(404).send({ result: 'Not found. Check id.' });
  }

  const user: User = generateUser(response);
  const responseBody: ApiResponse<User> = {
    result: user,
  };

  res.send(responseBody);
});

// 사용자 추가
router.post('', (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});

// 사용자 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const response = await prisma.user.findUnique({ where: { id } });

  if (!response) {
    return res.status(404).send({ result: 'Not found. Check userId.' });
  }

  const body: UpdateUserBody = req.body;
  const { userId, name, password } = body;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(userId && { user_id: userId }),
      ...(name && { name }),
      ...(password && { password }),
    },
  });

  if (!updatedUser) {
    return res.status(400).send({ result: 'Failed to update user' });
  }

  const user: User = generateUser(updatedUser);
  const responseBody: ApiResponse<User> = {
    result: user,
  };

  res.send(responseBody);
});

// 아바타 수정
router.put('/:id/avatar', verifyToken, upload.single('multipartFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ result: 'Invalid file' });
  }

  if (req.file.size > MAX_SIZE) {
    return res.status(400).json({ result: 'Upload only files under 10MB' });
  }

  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).send({ result: 'Not found. Check userId.' });
  }

  const ext = path.extname(req.file.originalname);
  const actualPath = path.join(storagePath + avatarPath, `${id}${ext}`);
  const targetPath = `${avatarPath}/${id}${ext}`;

  if (user.avatar_path) {
    const prevPath = path.join(storagePath, user.avatar_path);
    if (fs.existsSync(prevPath)) {
      fs.unlinkSync(prevPath);
    }
  }

  fs.renameSync(req.file.path, actualPath);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { avatar_path: targetPath },
  });

  const responseBody: ApiResponse<User> = {
    result: generateUser(updatedUser),
  };

  res.send(responseBody);
});

// 사용자 삭제
router.delete('', (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});
