import { Document, Types } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  filePath: string;
  fileType: string;
  size: number;
  uploadDate: Date;
  owner: Types.ObjectId;
  status: 'active' | 'archived';
  accessControl: {
    read: Types.ObjectId[];
    write: Types.ObjectId[];
    delete: Types.ObjectId[];
  };
  pinned: boolean;
  sharedWith: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
