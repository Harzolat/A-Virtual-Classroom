import { Schema, model, Document, Types } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Left Early' | 'Excused';

export interface IAttendance extends Document {
  student: Types.ObjectId;
  course?: Types.ObjectId;
  lecture?: Types.ObjectId;
  generalSession?: Types.ObjectId;
  date: Date;
  timeJoined: Date;
  timeLeft?: Date;
  durationMinutes: number;
  status: AttendanceStatus;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
      index: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: 'Lecture',
      required: false,
      index: true,
    },
    generalSession: {
      type: Schema.Types.ObjectId,
      ref: 'GeneralSession',
      required: false,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    timeJoined: {
      type: Date,
      default: Date.now,
      required: [true, 'Time joined is required'],
    },
    timeLeft: {
      type: Date,
      required: false,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Duration minutes cannot be negative'],
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Late', 'Absent', 'Left Early', 'Excused'],
        message: '{VALUE} is not a valid attendance status',
      },
      default: 'Present',
      required: true,
    },
    reason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Strict validation rules for attendance session links
attendanceSchema.pre('validate', function () {
  const hasLecture = Boolean(this.lecture);
  const hasGeneralSession = Boolean(this.generalSession);

  if (hasLecture && hasGeneralSession) {
    throw new Error('Attendance cannot reference both a lecture and a general session.');
  }
  if (!hasLecture && !hasGeneralSession) {
    throw new Error('Attendance must reference either a lecture or a general session.');
  }
  if (hasLecture && !this.course) {
    throw new Error('Course is required when attendance references a lecture.');
  }
});

// Compound unique index: student + lecture (one attendance record per student per lecture)
attendanceSchema.index(
  { student: 1, lecture: 1 },
  {
    unique: true,
    partialFilterExpression: { lecture: { $exists: true, $ne: null } },
  }
);

// Compound unique index: student + generalSession (one attendance record per student per general session)
attendanceSchema.index(
  { student: 1, generalSession: 1 },
  {
    unique: true,
    partialFilterExpression: { generalSession: { $exists: true, $ne: null } },
  }
);

// Additional high-performance query indexes
attendanceSchema.index({ student: 1, createdAt: -1 });
attendanceSchema.index({ course: 1, createdAt: -1 });

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;

