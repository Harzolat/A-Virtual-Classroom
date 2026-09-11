import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  role: 'student' | 'lecturer' | 'admin';
  name: string;
  email: string;
  passwordHash: string;
  department: string;
  avatar?: string;
  status: 'Active' | 'Suspended' | 'On Leave';
  matricNo?: string;
  staffId?: string;
  designation?: string;
  office?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ['student', 'lecturer', 'admin'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'On Leave'],
      default: 'Active',
      required: true,
    },
    matricNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    staffId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    designation: {
      type: String,
      default: '',
    },
    office: {
      type: String,
      default: '',
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

export const User = model<IUser>('User', userSchema);
export default User;
