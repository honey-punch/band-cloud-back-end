import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateSearchQuery, generateUser } from '../utils';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const storagePath = process.env.STORAGE_PATH || '/';
const avatarPath = process.env.AVATAR_PATH || '/';
const tempPath = path.join(storagePath, 'temp');
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}
const upload = multer({ dest: tempPath });

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
router.put('/:userId', async (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});

// 아바타 수정
router.put('/:userId/avatar', async (req, res) => {});

// 사용자 삭제
router.delete('', (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});
