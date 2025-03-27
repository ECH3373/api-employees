import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
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
