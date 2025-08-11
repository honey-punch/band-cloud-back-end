import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateSearchQuery } from '../utils';

export const router = Router();
const prisma = new PrismaClient();

// 사용자 리스트
router.get('/search', async (req, res) => {
  const query: SearchQuery = req.query;
  const { where, skip, take, size, page } = generateSearchQuery(query);

  const response = await prisma.user.findMany({ where, skip, take });

  const mappedResponse: User[] = response.map((user) => ({
    id: user.id,
    userId: user.user_id,
    name: user.name,
    ...(user.group_id ? { groupId: user.group_id } : {}),
    createdDate: user.created_date.toISOString(),
    isDeleted: user.is_deleted,
    ...(user.avatar_path ? { avatarPath: user.avatar_path } : {}),
  }));

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

  const user: User = {
    id: response.id,
    userId: response.user_id,
    name: response.name,
    ...(response.group_id ? { groupId: response.group_id } : {}),
    createdDate: response.created_date.toISOString(),
    isDeleted: response.is_deleted,
    ...(response.avatar_path ? { avatarPath: response.avatar_path } : {}),
  };

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
