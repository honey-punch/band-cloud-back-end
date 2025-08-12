import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { generateAsset, generateSearchQuery } from '../utils';
import { verifyToken } from '../middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storagePath = process.env.STORAGE_PATH || '/';
const audioPath = process.env.AUDIO_PATH || '/';
const tempPath = path.join(storagePath, 'temp');
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}
const upload = multer({ dest: tempPath });

export const router = Router();
const prisma = new PrismaClient();

// 에셋 리스트
router.get('/search', async (req, res) => {
  const query: SearchQuery = req.query;
  const { where, skip, take, size, page } = generateSearchQuery(query);

  const response = await prisma.asset.findMany({ where, skip, take });
  const mappedResponse: Asset[] = response.map((asset) => generateAsset(asset));

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

// 개별 에셋
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const response = await prisma.asset.findUnique({ where: { id } });

  if (!response) {
    return res.status(404).send({ message: 'Not found. Check id.' });
  }

  const asset: Asset = generateAsset(response);
  const responseBody: ApiResponse<Asset> = {
    result: asset,
  };

  res.send(responseBody);
});

// 에셋 생성
router.post('', verifyToken, async (req, res) => {
  const body: CreateAssetBody = req.body;
  const { userId, originalFileName } = body;

  if (!userId) {
    return res.status(400).send({ message: 'userId is required' });
  }

  const response = await prisma.asset.create({
    data: {
      user_id: userId,
      title: originalFileName.split('.')[0],
      asset_path: '',
      thumbnail_path: '',
      original_file_name: originalFileName,
    },
  });

  if (!response) {
    return res.status(400).send({ message: 'Failed to create asset' });
  }

  const asset: Asset = generateAsset(response);
  const responseBody: ApiResponse<Asset> = {
    result: asset,
  };

  res.send(responseBody);
});

// 에셋 업로드
router.post('/upload', verifyToken, upload.single('multipartFile'), async (req, res) => {
  const body: UploadBody = req.body;
  const { assetId } = body;
  const tempPath = req.file?.path || '';

  const createdAsset = await prisma.asset.findUnique({ where: { id: assetId } });

  if (!createdAsset) {
    return res.status(404).send({ message: 'Not found. Check assetId.' });
  }

  if (!fs.existsSync(storagePath + audioPath)) {
    return res.status(404).json({ error: 'There is no audio path' });
  }

  const ext = path.extname(createdAsset.original_file_name);
  const actualPath = path.join(storagePath + audioPath, `${assetId}${ext}`);
  const targetPath = `${audioPath}/${assetId}${ext}`;

  if (createdAsset.asset_path !== targetPath) {
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        asset_path: targetPath,
      },
    });
  }

  fs.appendFileSync(actualPath, fs.readFileSync(tempPath));
  fs.unlinkSync(tempPath);
  res.send({ result: 'Chunk appended' });
});
