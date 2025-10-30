import mongoose, { Schema, Document, Model } from 'mongoose';

// User interface
export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  projects: string[]; // Array of project IDs the user is assigned to
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    projects: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
