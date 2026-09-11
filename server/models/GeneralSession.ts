import { Schema, model, Document, Types } from 'mongoose';

export interface IGeneralSession extends Document {
  organizer: Types.ObjectId;
  title: string;
  category: string;
  description?: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  mode: 'Video' | 'Voice';
  status: 'Scheduled' | 'Live Now' | 'Completed' | 'Cancelled';
  meetingId: string;
  maxCapacity: number;
  allowStudentScreenShare: boolean;
  recordSession: boolean;
  autoAttendance: boolean;
  createdAt: Date;
}

const generalSessionSchema = new Schema<IGeneralSession>(
  {
    organizer: {
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
      default: 90,
    },
    mode: {
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
    maxCapacity: {
      type: Number,
      default: 100,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GeneralSession = model<IGeneralSession>('GeneralSession', generalSessionSchema);
export default GeneralSession;
