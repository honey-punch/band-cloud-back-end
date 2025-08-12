import { Asset as PrismaAsset, User as PrismaUser } from 'generated/prisma';

export function generateSearchQuery(query: SearchQuery) {
  const isDeleted = query.isDeleted === 'true';
  const limit = Number(query.limit) || 100;
  const page = Number(query.page) || 0;
  const size = Number(query.size) || 25;

  const where = {
    is_deleted: isDeleted,
  };

  const skip = page * size;
  const take = size > limit - skip ? Math.max(limit - skip, 0) : size;

  return { where, skip, take, size, page };
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
    ...(prismaUser.group_id ? { groupId: prismaUser.group_id } : {}),
    createdDate: prismaUser.created_date.toISOString(),
    isDeleted: prismaUser.is_deleted,
  };
}
