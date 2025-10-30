import mongoose, { Schema, Document, Model } from 'mongoose';

// Member interface for project access
export interface IMember {
  userId: string; // User email or ID
  role: 'owner' | 'member';
  addedAt: Date;
}

// Task interface for subgroup tables
export interface ITask {
  id: string;
  task: string;
  assignedTo: string;
  deadline: Date | null;
  status: 'todo' | 'in-progress' | 'done' | '';
  priority: 'high' | 'medium' | 'low' | '';
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
  userId: string; // Project owner
  description?: string;
  members: IMember[]; // Array of users assigned to this project
  subgroups: ISubgroup[];
  createdAt: Date;
  updatedAt: Date;
}

// Member schema
const MemberSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'member'],
    default: 'member',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Task schema
const TaskSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  task: {
    type: String,
    required: false,
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
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done', ''],
    default: '',
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low', ''],
    default: '',
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
    members: {
      type: [MemberSchema],
      default: [],
      index: true,
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
