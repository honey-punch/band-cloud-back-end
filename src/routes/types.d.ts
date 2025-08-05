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
  isDeleted?: string;
  limit?: string;
  page?: string;
  size?: string;
};
