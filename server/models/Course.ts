import { Schema, model, Document, Types } from 'mongoose';

export interface ISyllabusModule {
  moduleNumber: number;
  title: string;
  description: string;
  status: 'Completed' | 'Current' | 'Upcoming';
  learningObjectives: string[];
}

export interface ICourse extends Document {
  code: string;
  title: string;
  department: string;
  creditUnit: number;
  semester: string;
  description: string;
  lecturer: Types.ObjectId;
  enrolledStudents: Types.ObjectId[];
  syllabus: ISyllabusModule[];
  createdAt: Date;
}

const syllabusModuleSchema = new Schema<ISyllabusModule>(
  {
    moduleNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Completed', 'Current', 'Upcoming'],
      default: 'Upcoming',
      required: true,
    },
    learningObjectives: [{ type: String, trim: true }],
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    creditUnit: {
      type: Number,
      required: true,
      default: 3,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    syllabus: [syllabusModuleSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = model<ICourse>('Course', courseSchema);
export default Course;
