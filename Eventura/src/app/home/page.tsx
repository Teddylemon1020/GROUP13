"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPlus, FiFolder, FiLogOut, FiTrash2, FiMail } from "react-icons/fi";

interface IProject {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );
  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
    } else if (status === "authenticated") {
      fetchProjects();
      fetchPendingInvitations();
    }
  }, [status, router]);

  const fetchPendingInvitations = async () => {
    try {
      const response = await fetch("/api/invitations");
      if (response.ok) {
        const data = await response.json();
        const pending = data.invitations.filter(
          (inv: IInvitation) => inv.status === "pending"
        );
        setPendingInvitationsCount(pending.length);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    setCreatingProject(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Project ${projects.length + 1}`,
          description: "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/projects/${data.project._id}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingProjectId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove project from state
        setProjects(projects.filter((p) => p._id !== projectId));
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    } finally {
      setDeletingProjectId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main
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
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-6 relative"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-0">
            <div>
              <h1
                className="text-3xl sm:text-5xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                My Projects
              </h1>
              <p className="mt-2 sm:mt-3 text-base sm:text-lg" style={{ color: "var(--muted)" }}>
                Welcome back,{" "}
                <span style={{ color: "var(--primary)", fontWeight: "600" }}>
                  {session?.user?.name || "User"}
                </span>
              </p>
            </div>
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => router.push("/invitations")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative"
                style={{
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(79, 70, 229, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <FiMail size={20} />
                <span className="font-medium">Invitations</span>
                {pendingInvitationsCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--error)",
                      color: "#ffffff",
                    }}
                  >
                    {pendingInvitationsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  color: "var(--error)",
                  border: "1px solid var(--error)",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <FiLogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mobile buttons - Grid layout */}
          <div className="grid grid-cols-2 gap-2 sm:hidden mt-4">
            <button
              onClick={() => router.push("/invitations")}
              className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl transition-all duration-200 active:scale-95 relative"
              style={{
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                background: "transparent",
              }}
            >
              <FiMail size={20} />
              <span className="text-xs font-medium">Invitations</span>
              {pendingInvitationsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--error)",
                    color: "#ffffff",
                  }}
                >
                  {pendingInvitationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                color: "var(--error)",
                border: "1px solid var(--error)",
                background: "transparent",
              }}
            >
              <FiLogOut size={20} />
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Create Project Button */}
        <button
          onClick={handleCreateProject}
          disabled={creatingProject}
          className="mb-8 flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:scale-105 active:scale-95"
          style={{
            background: creatingProject ? "var(--muted)" : "var(--primary)",
            color: "#ffffff",
            boxShadow: "0 10px 15px -3px var(--shadow)",
          }}
          onMouseEnter={(e) =>
            !creatingProject &&
            (e.currentTarget.style.background = "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            !creatingProject &&
            (e.currentTarget.style.background = "var(--primary)")
          }
        >
          <FiPlus size={22} />
          {creatingProject ? "Creating..." : "Create New Project"}
        </button>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-6xl">📋</div>
            </div>
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              No projects yet
            </h2>
            <p className="mb-8 text-lg" style={{ color: "var(--muted)" }}>
              Create your first project to get started
            </p>
            <button
              onClick={handleCreateProject}
              disabled={creatingProject}
              className="flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
              style={{
                background: creatingProject ? "var(--muted)" : "var(--primary)",
                color: "#ffffff",
                boxShadow: "0 10px 15px -3px var(--shadow)",
              }}
              onMouseEnter={(e) =>
                !creatingProject &&
                (e.currentTarget.style.background = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                !creatingProject &&
                (e.currentTarget.style.background = "var(--primary)")
              }
            >
              <FiPlus size={22} />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group rounded-xl shadow-lg p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 10px 15px -3px var(--shadow)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px var(--shadow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px var(--shadow)";
                }}
              >
                {/* Delete Button - appears on hover */}
                <button
                  onClick={(e) => handleDeleteProject(project._id, e)}
                  disabled={deletingProjectId === project._id}
                  className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 z-10"
                  title="Delete project"
                  style={{
                    color: "var(--muted)",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--error)";
                    e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
                    e.currentTarget.style.borderColor = "var(--error)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  {deletingProjectId === project._id ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  ) : (
                    <FiTrash2 size={20} />
                  )}
                </button>

                {/* Card Content - clickable area */}
                <div
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl transition-shadow"
                      style={{
                        background: "var(--primary)",
                        boxShadow: "0 4px 6px -1px var(--shadow)",
                      }}
                    >
                      <FiFolder size={28} style={{ color: "#ffffff" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-xl font-bold truncate transition-colors"
                        style={{ color: "var(--foreground)" }}
                      >
                        {project.name}
                      </h3>
                      {project.description && (
                        <p
                          className="text-sm mt-2 line-clamp-2"
                          style={{ color: "var(--muted)" }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs pt-3"
                    style={{
                      color: "var(--muted)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "var(--primary)" }}
                    ></div>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
