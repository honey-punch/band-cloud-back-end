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
  // 에셋
  userId?: string;
  title?: string;

  // 밴드
  name?: string;

  // 공통
  isDeleted?: string;
  page?: string;
  size?: string;
  sort?: string;
  limit?: number;
};
