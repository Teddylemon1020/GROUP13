import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/utils/mongodb';
import Project from '@/models/projectmodel';
import User from '@/models/usermodel';
import { authOptions } from '@/lib/auth';

// GET all projects for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find projects where user is either the owner OR a member
    const projects = await Project.find({
      $or: [
        { userId: session.user.email },
        { 'members.userId': session.user.email }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, description } = body;

    // Create the project with the owner in the members array
    const project = await Project.create({
      name: name || 'Untitled Project',
      description: description || '',
      userId: session.user.email,
      members: [
        {
          userId: session.user.email,
          role: 'owner',
          addedAt: new Date(),
        }
      ],
      subgroups: [],
    });

    // Add the project to the user's projects array
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      if (!user.projects) {
        user.projects = [];
      }
      user.projects.push(String(project._id));
      await user.save();
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
