import mongoose from 'mongoose';
import { IFile } from './file.interface';

const fileSchema = new mongoose.Schema<IFile>({
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'archived', 'deleted'],
  },
  accessControl: {
    type: Object,
    default: {
      read: [],
      write: [],
      delete: [],
    },
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const File = mongoose.model<IFile>('File', fileSchema);

export default File;
