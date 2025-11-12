import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/utils/mongodb";
import Project from "@/models/projectmodel";
import User from "@/models/usermodel";

// POST /api/projects/[id]/members - Assign a user to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const { id } = await params;

    // Get the project
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the requester is the project owner
    if (project.userId !== session.user.email) {
      return NextResponse.json(
        { error: "Only the project owner can assign members" },
        { status: 403 }
      );
    }

    // Check if the user exists
    const userToAssign = await User.findOne({ email: userEmail });

    if (!userToAssign) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already a member
    const isMember = project.members?.some(
      (member) => member.userId === userEmail
    );

    if (isMember) {
      return NextResponse.json(
        { error: "User is already a member of this project" },
        { status: 400 }
      );
    }

    // Add the user to the project's members array
    if (!project.members) {
      project.members = [];
    }

    project.members.push({
      userId: userEmail,
      role: "member",
      addedAt: new Date(),
    });

    await project.save();

    // Add the project to the user's projects array
    if (!userToAssign.projects) {
      userToAssign.projects = [];
    }

    if (!userToAssign.projects.includes(id)) {
      userToAssign.projects.push(id);
      await userToAssign.save();
    }

    return NextResponse.json({
      message: "User assigned to project successfully",
      member: {
        userId: userEmail,
        role: "member",
      },
    });
  } catch (error) {
    console.error("Error assigning user to project:", error);
    return NextResponse.json(
      { error: "Failed to assign user to project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/members - Remove a user from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const { id } = await params;

    // Get the project
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the requester is the project owner
    if (project.userId !== session.user.email) {
      return NextResponse.json(
        { error: "Only the project owner can remove members" },
        { status: 403 }
      );
    }

    // Remove the user from the project's members array
    project.members =
      project.members?.filter((member) => member.userId !== userEmail) || [];

    await project.save();

    // Remove the project from the user's projects array
    const user = await User.findOne({ email: userEmail });

    if (user) {
      user.projects =
        user.projects?.filter((projectId) => projectId !== id) || [];
      await user.save();
    }

    return NextResponse.json({
      message: "User removed from project successfully",
    });
  } catch (error) {
    console.error("Error removing user from project:", error);
    return NextResponse.json(
      { error: "Failed to remove user from project" },
      { status: 500 }
    );
  }
}
