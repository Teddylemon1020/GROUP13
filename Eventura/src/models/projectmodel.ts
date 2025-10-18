import mongoose, { Schema, Document, Model } from 'mongoose';

// Task interface for subgroup tables
export interface ITask {
  id: string;
  task: string;
  assignedTo: string;
  deadline: Date | null;
}

// Subgroup interface
export interface ISubgroup {
  id: string;
  title: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

// Project interface
export interface IProject extends Document {
  name: string;
  userId: string;
  description?: string;
  subgroups: ISubgroup[];
  createdAt: Date;
  updatedAt: Date;
}

// Task schema
const TaskSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  task: {
    type: String,
    required: true,
    default: '',
  },
  assignedTo: {
    type: String,
    default: '',
  },
  deadline: {
    type: Date,
    default: null,
  },
});

// Subgroup schema
const SubgroupSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Subgroup',
  },
  tasks: {
    type: [TaskSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Project schema
const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      default: 'Untitled Project',
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    subgroups: {
      type: [SubgroupSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
