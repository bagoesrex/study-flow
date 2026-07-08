export type SubjectItem = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  targetHours: number | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};
