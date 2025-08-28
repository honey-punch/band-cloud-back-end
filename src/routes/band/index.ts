import { Router } from 'express';
import { Prisma, PrismaClient } from 'generated/prisma';
import { camelToSnake, generateBand, generateSearchQuery } from '../utils';
import SortOrder = Prisma.SortOrder;

export const router = Router();
const prisma = new PrismaClient();

// 밴드 리스트
router.get('/search', async (req, res) => {
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
    prisma.band.findMany({ where, skip, take, orderBy }),
    prisma.band.count({ where }),
  ]);
  const mappedResponse: Band[] = response.map((band) => generateBand(band));

  const totalPage = Math.ceil(totalCount / size);
  const currentPage = page;

  const responseBody: ApiResponse<Band[]> = {
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

// 개별 밴드
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

router.post('', async (req, res) => {
  const body: CreateBandBody = req.body;
  const { leaderId, name, description } = body;

  const leader = await prisma.user.findUnique({ where: { id: leaderId } });

  if (!leader) {
    return res.status(400).send({ result: 'Not found. Check leaderId.' });
  }

  if (!name) {
    return res.status(400).send({ result: 'Invalid name' });
  }

  const response = await prisma.band.create({
    data: {
      leader_id: leaderId,
      name,
      ...(description ? { description } : {}),
    },
  });

  if (!response) {
    return res.status(400).send({ result: 'Failed to create band' });
  }

  const band: Band = generateBand(response);
  const responseBody: ApiResponse<Band> = {
    result: band,
  };

  res.send(responseBody);
});
