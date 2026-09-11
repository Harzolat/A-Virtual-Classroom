import { Schema, model, Document, Types } from 'mongoose';

export interface ILectureResource {
  name: string;
  size: string;
  url: string;
}

export interface ILecture extends Document {
  course: Types.ObjectId;
  lecturer: Types.ObjectId;
  title: string;
  description?: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: 'Video' | 'Voice';
  status: 'Scheduled' | 'Live Now' | 'Completed' | 'Cancelled';
  meetingId: string;
  roomPasscode?: string;
  maxCapacity: number;
  allowStudentScreenShare: boolean;
  recordSession: boolean;
  autoAttendance: boolean;
  recordingUrl?: string;
  resources: ILectureResource[];
  createdAt: Date;
}

const lectureResourceSchema = new Schema<ILectureResource>(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    url: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const lectureSchema = new Schema<ILecture>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 120,
    },
    type: {
      type: String,
      enum: ['Video', 'Voice'],
      default: 'Video',
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Live Now', 'Completed', 'Cancelled'],
      default: 'Scheduled',
      required: true,
    },
    meetingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    roomPasscode: {
      type: String,
      default: '',
    },
    maxCapacity: {
      type: Number,
      default: 150,
      required: true,
    },
    allowStudentScreenShare: {
      type: Boolean,
      default: true,
      required: true,
    },
    recordSession: {
      type: Boolean,
      default: true,
      required: true,
    },
    autoAttendance: {
      type: Boolean,
      default: true,
      required: true,
    },
    recordingUrl: {
      type: String,
      default: '',
    },
    resources: [lectureResourceSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture = model<ILecture>('Lecture', lectureSchema);
export default Lecture;
