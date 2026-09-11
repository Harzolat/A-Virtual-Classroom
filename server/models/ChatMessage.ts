import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  meetingId: string;
  sender: Types.ObjectId;
  text: string;
  isPinned: boolean;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    meetingId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast timeline queries per meeting
chatMessageSchema.index({ meetingId: 1, createdAt: 1 });

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);
export default ChatMessage;
