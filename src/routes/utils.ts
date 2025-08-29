import {
  Asset as PrismaAsset,
  User as PrismaUser,
  Reply as PrismaReply,
  Band as PrismaBand,
} from 'generated/prisma';

export function generateSearchQuery(query: SearchQuery) {
  const isDeleted = query.isDeleted === 'true';
  const limit = Number(query.limit) || 100;
  const page = Number(query.page) || 0;
  const size = Number(query.size) || 25;

  const where: { [key: string]: unknown } = {
    is_deleted: isDeleted,
  };

  if (query.userId && Array.isArray(query.userId)) {
    where.user_id = { in: query.userId };
  }
  if (query.title) where.title = { contains: query.title, mode: 'insensitive' };
  if (query.isPublic) where.is_public = changeStringToBoolean(query.isPublic);
  if (query.belongBandId) where.belong_band_id = query.belongBandId;

  if (query.name) where.name = { contains: query.name, mode: 'insensitive' };
  if (query.bandId) {
    where.band_ids = { has: query.bandId };
  }

  const skip = page * size;
  const take = size > limit - skip ? Math.max(limit - skip, 0) : size;

  return { where, skip, take, size, page };
}

function changeStringToBoolean(value: string) {
  return value === 'true';
}

export function generateAsset(prismaAsset: PrismaAsset): Asset {
  return {
    id: prismaAsset.id,
    title: prismaAsset.title,
    assetPath: prismaAsset.asset_path,
    thumbnailPath: prismaAsset.thumbnail_path,
    originalFileName: prismaAsset.original_file_name,
    userId: prismaAsset.user_id,
    createdDate: prismaAsset.created_date.toISOString(),
    isPublic: prismaAsset.is_public,
    ...(prismaAsset.description ? { description: prismaAsset.description } : {}),
    isDeleted: prismaAsset.is_deleted,
  };
}

export function generateUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    userId: prismaUser.user_id,
    name: prismaUser.name,
    bandIds: prismaUser.band_ids,
    createdDate: prismaUser.created_date.toISOString(),
    isDeleted: prismaUser.is_deleted,
  };
}

export function generateReply(prismaReply: PrismaReply): Reply {
  return {
    id: prismaReply.id,
    content: prismaReply.content,
    userId: prismaReply.user_id,
    assetId: prismaReply.asset_id,
    createdDate: prismaReply.created_date.toISOString(),
    isDeleted: prismaReply.is_deleted,
  };
}

export function generateBand(prismaBand: PrismaBand): Band {
  return {
    id: prismaBand.id,
    name: prismaBand.name,
    description: prismaBand.description,
    createdDate: prismaBand.created_date.toISOString(),
    isDeleted: prismaBand.is_deleted,
    leaderId: prismaBand.leader_id,
  };
}

export function camelToSnake(camel: string): string {
  return camel.replace(/([A-Z])/g, '_$1').toLowerCase();
}
