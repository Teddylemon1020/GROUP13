import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/utils/mongodb";
import Invitation from "@/models/invitationmodel";

// GET /api/invitations - Get all invitations for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all invitations for the user
    const invitations = await Invitation.find({
      inviteeEmail: session.user.email,
    }).sort({ createdAt: -1 });

    // Filter out expired invitations and update their status
    const now = new Date();
    const validInvitations = [];

    for (const invitation of invitations) {
      if (invitation.status === "pending" && invitation.expiresAt < now) {
        invitation.status = "rejected";
        await invitation.save();
      }
      validInvitations.push(invitation);
    }

    return NextResponse.json({
      invitations: validInvitations,
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
