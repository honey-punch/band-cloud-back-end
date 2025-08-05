type Asset = {
  id: string;
  title: string;
  path: string;
  originalFileName: string;
  userId: string;
  createdDate: string;
  isPublic: boolean;
  description?: string | null;
  isDeleted: boolean;
};
