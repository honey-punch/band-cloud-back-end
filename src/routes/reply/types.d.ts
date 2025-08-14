type Reply = {
  id: string;
  content: string;
  userId: string;
  assetId: string;
  createdDate: string;
  isDeleted: boolean;
};

type CreateReplyBody = { content: stirng; userId: string };
type UpdateReplyBody = { content: stirng };
