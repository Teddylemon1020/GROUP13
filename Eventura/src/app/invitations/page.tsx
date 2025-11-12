"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiCheck, FiX, FiClock, FiUser } from "react-icons/fi";

interface IInvitation {
  _id: string;
  projectId: string;
  projectName: string;
  inviterEmail: string;
  inviterName?: string;
  inviteeEmail: string;
  status: "pending" | "accepted" | "rejected";
  token: string;
  expiresAt: string;
  createdAt: string;
}

export default function InvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/invitations");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations);
      } else {
        console.error("Failed to fetch invitations");
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (token: string, action: "accept" | "reject") => {
    setProcessingId(token);
    try {
      const response = await fetch("/api/invitations/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action }),
      });

      if (response.ok) {
        const data = await response.json();
        if (action === "accept") {
          alert(`Successfully joined ${data.project?.name || "the project"}!`);
          router.push("/home");
        } else {
          alert("Invitation rejected");
          fetchInvitations();
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to respond to invitation"}`);
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      alert("Failed to respond to invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");
  const respondedInvitations = invitations.filter((inv) => inv.status !== "pending");

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10"
            style={{ color: "var(--primary)" }}
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <div className="text-lg" style={{ color: "var(--muted)" }}>
            Loading invitations...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/home")}
            className="mb-6 flex items-center gap-2 transition-colors group"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <FiMail size={32} style={{ color: "var(--primary)" }} />
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Project Invitations
            </h1>
          </div>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Manage your project invitations
          </p>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <FiClock style={{ color: "var(--primary)" }} />
              Pending Invitations
            </h2>
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="rounded-xl shadow-lg p-6 transition-all"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: "var(--foreground)" }}
                      >
                        {invitation.projectName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser size={16} style={{ color: "var(--muted)" }} />
                        <span style={{ color: "var(--muted)" }}>
                          Invited by{" "}
                          <span style={{ color: "var(--foreground)" }}>
                            {invitation.inviterName || invitation.inviterEmail}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock size={16} style={{ color: "var(--muted)" }} />
                        <span className="text-sm" style={{ color: "var(--muted)" }}>
                          Expires on{" "}
                          {new Date(invitation.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRespond(invitation.token, "accept")}
                        disabled={processingId === invitation.token}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                        style={{
                          background: "var(--success)",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) =>
                          !processingId && (e.currentTarget.style.opacity = "0.9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        <FiCheck size={18} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(invitation.token, "reject")}
                        disabled={processingId === invitation.token}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                        style={{
                          background: "var(--error)",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) =>
                          !processingId && (e.currentTarget.style.opacity = "0.9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        <FiX size={18} />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Pending Invitations */}
        {pendingInvitations.length === 0 && (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <FiMail
              size={64}
              className="mx-auto mb-4"
              style={{ color: "var(--muted)" }}
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              No pending invitations
            </h3>
            <p style={{ color: "var(--muted)" }}>
              You don&apos;t have any pending project invitations at the moment.
            </p>
          </div>
        )}

        {/* Responded Invitations */}
        {respondedInvitations.length > 0 && (
          <div className="mt-8">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Previous Invitations
            </h2>
            <div className="space-y-3">
              {respondedInvitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="rounded-lg p-4 opacity-60"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {invitation.projectName}
                      </h4>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>
                        From {invitation.inviterName || invitation.inviterEmail}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invitation.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {invitation.status === "accepted" ? "Accepted" : "Declined"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
