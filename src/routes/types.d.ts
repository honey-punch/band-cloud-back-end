interface ApiResponse<T> {
  result: T;
  page?: {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    size: number;
  };
}

type SearchQuery = {
  userId?: string;
  title?: string;
  isDeleted?: string;
  page?: string;
  size?: string;
  sort?: string;
  limit?: number;
};
