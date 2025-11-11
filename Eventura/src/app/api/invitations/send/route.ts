import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/utils/mongodb";
import Project from "@/models/projectmodel";
import User from "@/models/usermodel";
import Invitation from "@/models/invitationmodel";
import { sendInvitationEmail } from "@/utils/emailService";
import crypto from "crypto";

// POST /api/invitations/send - Send an invitation to join a project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, userEmail } = await request.json();

    if (!projectId || !userEmail) {
      return NextResponse.json(
        { error: "Project ID and user email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the project
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the requester is the project owner
    if (project.userId !== session.user.email) {
      return NextResponse.json(
        { error: "Only the project owner can send invitations" },
        { status: 403 }
      );
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

    // Check if there's already a pending invitation
    const existingInvitation = await Invitation.findOne({
      projectId,
      inviteeEmail: userEmail,
      status: "pending",
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this user" },
        { status: 400 }
      );
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await Invitation.create({
      projectId,
      projectName: project.name,
      inviterEmail: session.user.email,
      inviterName: session.user.name || session.user.email,
      inviteeEmail: userEmail,
      status: "pending",
      token,
      expiresAt,
    });

    // Send invitation email
    const inviteLink = `${process.env.NEXTAUTH_URL}/invitations/accept?token=${token}`;

    const emailResult = await sendInvitationEmail({
      to: userEmail,
      projectName: project.name,
      inviterName: session.user.name || session.user.email,
      inviteLink,
      expiresInDays: 7,
    });

    if (!emailResult.success) {
      // Delete the invitation if email fails
      await Invitation.findByIdAndDelete(invitation._id);
      return NextResponse.json(
        { error: "Failed to send invitation email. Please check SMTP configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation._id,
        inviteeEmail: userEmail,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
