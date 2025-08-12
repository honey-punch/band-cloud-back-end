import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateSearchQuery, generateUser } from '../utils';

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
    return res.status(404).send({ message: 'Not found. Check id.' });
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
router.put('', (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});

// 사용자 삭제
router.delete('', (req, res) => {
  const { method, url } = req;

  console.log(method, url);

  res.send({ user: 'user' });
});
