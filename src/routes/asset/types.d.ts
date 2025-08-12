type Asset = {
  id: string;
  title: string;
  assetPath: string;
  thumbnailPath: string;
  originalFileName: string;
  userId: string;
  createdDate: string;
  isPublic: boolean;
  description?: string | null;
  isDeleted: boolean;
};

type CreateAssetBody = {
  userId: string;
  originalFileName: string;
};

type UploadBody = {
  assetId: string;
  multipartFile: Blob;
};
