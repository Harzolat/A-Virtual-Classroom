import { Schema, model, Document, Types } from 'mongoose';

export interface IClassroomParticipant {
  user: Types.ObjectId;
  role: 'student' | 'lecturer' | 'admin';
  joinedAt: Date;
}

export interface IClassroom extends Document {
  meetingId: string;
  lecture?: Types.ObjectId;
  generalSession?: Types.ObjectId;
  host: Types.ObjectId;
  status: 'inactive' | 'active' | 'ended';
  activeParticipants: IClassroomParticipant[];
  createdAt: Date;
}

const classroomParticipantSchema = new Schema<IClassroomParticipant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'lecturer', 'admin'],
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const classroomSchema = new Schema<IClassroom>(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: 'Lecture',
      required: false,
    },
    generalSession: {
      type: Schema.Types.ObjectId,
      ref: 'GeneralSession',
      required: false,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['inactive', 'active', 'ended'],
      default: 'inactive',
      required: true,
    },
    activeParticipants: [classroomParticipantSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Classroom = model<IClassroom>('Classroom', classroomSchema);
export default Classroom;
