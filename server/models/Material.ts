import { Schema, model, Document, Types } from 'mongoose';

export interface IMaterial extends Document {
  course: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  title: string;
  category: string;
  format: string;
  size: string;
  fileUrl: string;
  description?: string;
  downloads: number;
  uploadedDate: Date;
  createdAt: Date;
}

const materialSchema = new Schema<IMaterial>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    downloads: {
      type: Number,
      default: 0,
      required: true,
    },
    uploadedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = model<IMaterial>('Material', materialSchema);
export default Material;
