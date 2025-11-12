import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/utils/mongodb";
import Project from "@/models/projectmodel";
import User from "@/models/usermodel";
import Invitation from "@/models/invitationmodel";

// POST /api/invitations/respond - Accept or reject an invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, action } = await request.json();

    if (!token || !action) {
      return NextResponse.json(
        { error: "Token and action are required" },
        { status: 400 }
      );
    }

    if (action !== "accept" && action !== "reject") {
      return NextResponse.json(
        { error: "Action must be 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the invitation
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation is for the logged-in user
    if (invitation.inviteeEmail !== session.user.email) {
      return NextResponse.json(
        { error: "This invitation is not for you" },
        { status: 403 }
      );
    }

    // Check if invitation has already been responded to
    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: `This invitation has already been ${invitation.status}` },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = "rejected";
      await invitation.save();
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      // Simply update the invitation status
      invitation.status = "rejected";
      await invitation.save();

      return NextResponse.json({
        message: "Invitation rejected",
      });
    }

    // Accept the invitation
    const project = await Project.findById(invitation.projectId);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member (in case they were added directly)
    const isMember = project.members?.some(
      (member) => member.userId === session.user.email
    );

    if (isMember) {
      invitation.status = "accepted";
      await invitation.save();
      return NextResponse.json(
        { error: "You are already a member of this project" },
        { status: 400 }
      );
    }

    // Add the user to the project's members array
    if (!project.members) {
      project.members = [];
    }

    project.members.push({
      userId: session.user.email,
      role: "member",
      addedAt: new Date(),
    });

    await project.save();

    // Add the project to the user's projects array
    const user = await User.findOne({ email: session.user.email });

    if (user) {
      if (!user.projects) {
        user.projects = [];
      }

      if (!user.projects.includes(invitation.projectId)) {
        user.projects.push(invitation.projectId);
        await user.save();
      }
    }

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    return NextResponse.json({
      message: "Invitation accepted successfully",
      project: {
        id: project._id,
        name: project.name,
      },
    });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return NextResponse.json(
      { error: "Failed to respond to invitation" },
      { status: 500 }
    );
  }
}
