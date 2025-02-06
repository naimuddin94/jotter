import { Document, Types } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  folderPath: string;
  owner: Types.ObjectId;
  parentFolder: Types.ObjectId | null; 
  files: Types.ObjectId[];
  pinned: boolean;
  status: 'active' | 'archived';
  accessControl: {
    read: Types.ObjectId[]; 
    write: Types.ObjectId[];
    delete: Types.ObjectId[]; 
  };
  createdAt: Date;
  updatedAt: Date;
}


