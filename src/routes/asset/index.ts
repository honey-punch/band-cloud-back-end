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
    assetPath: asset.asset_path,
    thumbnailPath: asset.thumbnail_path,
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const response = await prisma.asset.findUnique({ where: { id } });

  if (!response) {
    return res.status(404).send({ message: 'Not found. Check id.' });
  }

  const asset: Asset = {
    id: response.id,
    title: response.title,
    assetPath: response.asset_path,
    thumbnailPath: response.thumbnail_path,
    originalFileName: response.original_file_name,
    userId: response.user_id,
    createdDate: response.created_date.toISOString(),
    isPublic: response.is_public,
    ...(response.description ? { description: response.description } : {}),
    isDeleted: response.is_deleted,
  };

  const responseBody: ApiResponse<Asset> = {
    result: asset,
  };

  res.send(responseBody);
});
