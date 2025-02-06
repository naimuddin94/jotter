import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    folderPath: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
);

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;
