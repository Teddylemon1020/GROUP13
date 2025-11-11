"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch("/api/invitations");
      if (response.ok) {
        const data = await response.json();
        const inv = data.invitations.find((i: any) => i.token === token);

        if (inv) {
          setInvitation(inv);

          // Check if already responded
          if (inv.status !== "pending") {
            setError(`This invitation has already been ${inv.status}`);
          }

          // Check if expired
          if (new Date(inv.expiresAt) < new Date()) {
            setError("This invitation has expired");
          }
        } else {
          setError("Invitation not found");
        }
      } else {
        setError("Failed to load invitation");
      }
    } catch (error) {
      console.error("Error fetching invitation:", error);
      setError("Failed to load invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (action: "accept" | "reject") => {
    if (!token) return;

    setProcessing(true);
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
          router.push(`/projects/${invitation.projectId}`);
        } else {
          alert("Invitation declined");
          router.push("/home");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to respond to invitation");
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      setError("Failed to respond to invitation");
    } finally {
      setProcessing(false);
    }
  };

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
            Loading invitation...
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--background)" }}
      >
        <div
          className="max-w-md w-full rounded-xl p-8 text-center"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <FiAlertCircle
            size={64}
            className="mx-auto mb-4"
            style={{ color: "var(--error)" }}
          />
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {error || "Invitation Not Found"}
          </h1>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            This invitation link may be invalid, expired, or already used.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: "var(--primary)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--background)" }}
    >
      <div
        className="max-w-2xl w-full rounded-xl shadow-2xl p-8"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="text-center mb-8">
          <FiMail
            size={64}
            className="mx-auto mb-4"
            style={{ color: "var(--primary)" }}
          />
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--primary)" }}
          >
            You're Invited!
          </h1>
        </div>

        <div className="mb-8">
          <div
            className="rounded-lg p-6 mb-4"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              {invitation.projectName}
            </h2>
            <p style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--foreground)" }}>
                {invitation.inviterName || invitation.inviterEmail}
              </span>{" "}
              has invited you to join this project on Eventura.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <FiAlertCircle size={16} />
            <span>
              This invitation expires on{" "}
              {new Date(invitation.expiresAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleRespond("accept")}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50"
            style={{
              background: "var(--success)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              !processing && (e.currentTarget.style.opacity = "0.9")
            }
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <FiCheck size={20} />
            Accept & Join Project
          </button>
          <button
            onClick={() => handleRespond("reject")}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50"
            style={{
              background: "var(--error)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              !processing && (e.currentTarget.style.opacity = "0.9")
            }
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <FiX size={20} />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
