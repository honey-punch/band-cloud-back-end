type User = {
  id: string;
  userId: string;
  name: string;
  groupId?: string | null;
  createdDate: string;
  isDeleted: boolean;
  avatarPath?: string | null;
  bandIds: string[];
};

type AvatarUploadBody = {
  userId: string;
  multipartFile: Blob;
};
