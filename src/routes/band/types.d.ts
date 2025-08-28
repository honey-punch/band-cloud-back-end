type Band = {
  id: string;
  name: string;
  description?: string | null;
  createdDate: string;
  isDeleted: boolean;
  leaderId: string;
};

type CreateBandBody = { name: string; leaderId: string; description?: string };
