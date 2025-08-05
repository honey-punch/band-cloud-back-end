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
