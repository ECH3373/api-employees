import mongoose from 'mongoose';
import { v4 } from 'uuid';

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: v4,
      unique: true,
      index: true,
    },

    code: {
      type: String,
      trim: true,
      required: [true, 'the code is required'],
    },

    name: {
      type: String,
      trim: true,
      required: [true, 'the name is required'],
    },

    avatar: {
      type: String,
      trim: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    department_id: {
      type: String,
      required: [true, 'the department_id is required'],
      trim: true,
      index: true,
    },
  },
  { versionKey: false },
);

export const model = mongoose.model('Employee', schema);
