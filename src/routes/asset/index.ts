import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateSearchQuery } from '../utils';

export const router = Router();
const prisma = new PrismaClient();

// 에셋 리스트
router.get('/search', async (req, res) => {
  const query: SearchQuery = req.query;
  const { where, skip, take, size, page } = generateSearchQuery(query);

  const response = await prisma.asset.findMany({ where, skip, take });

  const mappedResponse: Asset[] = response.map((asset) => ({
    id: asset.id,
    title: asset.title,
    path: asset.path,
    originalFileName: asset.original_file_name,
    userId: asset.user_id,
    createdDate: asset.created_date.toISOString(),
    isPublic: asset.is_public,
    ...(asset.description ? { description: asset.description } : {}),
    isDeleted: asset.is_deleted,
  }));

  const totalCount = await prisma.asset.count({ where });
  const totalPage = Math.ceil(totalCount / size);
  const currentPage = page;

  const responseBody: ApiResponse<Asset[]> = {
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
