import { Router } from 'express';
import { Prisma, PrismaClient } from 'generated/prisma';
import { camelToSnake, generateReply, generateSearchQuery } from '../utils';
import { verifyToken } from '../middleware';
import SortOrder = Prisma.SortOrder;

export const router = Router();
const prisma = new PrismaClient();

// 댓글 리스트
router.get('/:assetId', async (req, res) => {
  const { assetId } = req.params;

  const query: SearchQuery = req.query;
  const { where, skip, take, size, page } = generateSearchQuery(query);

  const sort = query.sort || 'created_date,desc';
  const sortArray = sort.split(',');
  const sortField = sortArray[0];
  const sortOrder = sortArray[1] as SortOrder;

  const orderBy = {
    [camelToSnake(sortField)]: sortOrder,
  };

  const [response, totalCount] = await Promise.all([
    prisma.reply.findMany({
      where: { ...where, asset_id: assetId },
      skip,
      take,
      orderBy,
    }),
    prisma.reply.count({ where: { ...where, asset_id: assetId } }),
  ]);

  const mappedResponse: Reply[] = response.map((asset) => generateReply(asset));

  const totalPage = Math.ceil(totalCount / size);
  const currentPage = page;

  const responseBody: ApiResponse<Reply[]> = {
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

// 댓글 생성
router.post('/:assetId', verifyToken, async (req, res) => {
  const { assetId } = req.params;
  const body: CreateReplyBody = req.body;
  const { content, userId } = body;

  if (!assetId) {
    return res.status(400).send({ result: 'Invalid assetId' });
  }

  if (!content || !userId) {
    return res.status(400).send({ result: 'Invalid content or userId' });
  }

  const response = await prisma.reply.create({
    data: {
      content,
      user_id: userId,
      asset_id: assetId,
    },
  });

  if (!response) {
    return res.status(400).send({ result: 'Failed to create reply' });
  }

  const reply: Reply = generateReply(response);
  const responseBody: ApiResponse<Reply> = {
    result: reply,
  };

  res.send(responseBody);
});

// 댓글 수정
router.put('/:replyId', verifyToken, async (req, res) => {
  const { replyId } = req.params;
  const body: UpdateReplyBody = req.body;
  const { content } = body;

  if (!replyId) {
    return res.status(400).send({ result: 'Invalid replyId' });
  }

  if (!content) {
    return res.status(400).send({ result: 'Invalid content or userId' });
  }

  const response = await prisma.reply.update({ where: { id: replyId }, data: { content } });

  if (!response) {
    return res.status(400).send({ result: 'Failed to update reply' });
  }

  const reply: Reply = generateReply(response);
  const responseBody: ApiResponse<Reply> = {
    result: reply,
  };

  res.send(responseBody);
});

// 댓글 삭제
router.delete('/:replyId', verifyToken, async (req, res) => {
  const { replyId } = req.params;

  if (!replyId) {
    return res.status(400).send({ result: 'Invalid replyId' });
  }

  const response = await prisma.reply.update({
    where: { id: replyId },
    data: { is_deleted: true },
  });

  if (!response) {
    return res.status(400).send({ result: 'Failed to delete reply' });
  }

  const reply: Reply = generateReply(response);
  const responseBody: ApiResponse<Reply> = {
    result: reply,
  };

  res.send(responseBody);
});
