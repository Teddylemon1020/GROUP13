import mongoose, { Schema, Document, Model } from 'mongoose';

// Invitation interface
export interface IInvitation extends Document {
  projectId: string;
  projectName: string;
  inviterEmail: string; // Who sent the invitation
  inviterName?: string;
  inviteeEmail: string; // Who is being invited
  status: 'pending' | 'accepted' | 'rejected';
  token: string; // Unique token for accepting the invitation
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Invitation schema
const InvitationSchema = new Schema<IInvitation>(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    inviterEmail: {
      type: String,
      required: true,
    },
    inviterName: {
      type: String,
    },
    inviteeEmail: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate pending invitations
InvitationSchema.index({ projectId: 1, inviteeEmail: 1, status: 1 });

// Prevent model recompilation in development
const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
