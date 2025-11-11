"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiFileText,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiMail,
  FiUsers,
  FiSend,
} from "react-icons/fi";

interface ITask {
  id: string;
  task: string;
  assignedTo: string;
  deadline: Date | null;
  status: "todo" | "in-progress" | "done" | "";
  priority: "high" | "medium" | "low" | "";
  comment: string;
}

interface ISubgroup {
  id: string;
  title: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

interface IMember {
  userId: string;
  role: "owner" | "member";
  addedAt: Date;
}

interface IProject {
  _id: string;
  name: string;
  userId: string;
  description?: string;
  members: IMember[];
  subgroups: ISubgroup[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
}

// Status Dropdown Component
function StatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: "todo" | "in-progress" | "done" | "") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const statusOptions = [
    { value: "", label: "Empty", color: "bg-gray-700/50 text-gray-400" },
    { value: "todo", label: "To Do", color: "bg-gray-700/50 text-gray-300" },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-blue-500/20 text-blue-400",
    },
    { value: "done", label: "Done", color: "bg-green-500/20 text-green-400" },
  ];

  const selectedOption =
    statusOptions.find((opt) => opt.value === value) || statusOptions[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 ${
          selectedOption.color
        } ${!value && "text-gray-500"}`}
      >
        {selectedOption.label}
      </button>
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] mt-1 rounded-lg shadow-2xl py-1 w-[100px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 25px 50px -12px var(--shadow)",
            }}
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value as any);
                  setIsOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${option.color}`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

// Priority Dropdown Component
function PriorityDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: "high" | "medium" | "low" | "") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const priorityOptions = [
    {
      value: "",
      label: "Empty",
      color: "bg-gray-700/50 text-gray-400",
      icon: "○",
    },
    {
      value: "high",
      label: "High",
      color: "bg-red-500/20 text-red-400",
      icon: "●",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-500/20 text-yellow-400",
      icon: "●",
    },
    {
      value: "low",
      label: "Low",
      color: "bg-blue-500/20 text-blue-400",
      icon: "●",
    },
  ];

  const selectedOption =
    priorityOptions.find((opt) => opt.value === value) || priorityOptions[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 flex items-center gap-1 ${
          selectedOption.color
        } ${!value && "text-gray-500"}`}
      >
        <span>{selectedOption.icon}</span>
        <span>{selectedOption.label}</span>
      </button>
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] mt-1 rounded-lg shadow-2xl py-1 w-[100px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 25px 50px -12px var(--shadow)",
            }}
          >
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value as any);
                  setIsOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${option.color}`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

// Assigned To Dropdown Component
function AssignedToDropdown({
  value,
  onChange,
  users,
}: {
  value: string;
  onChange: (value: string) => void;
  users: IUser[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const selectedUser = users.find((user) => user.email === value);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[140px] text-left flex items-center gap-2"
        style={{
          background: "var(--input-bg)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--card-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--input-bg)")
        }
      >
        {selectedUser ? (
          <>
            {selectedUser.image && (
              <img
                src={selectedUser.image}
                alt={selectedUser.name || selectedUser.email}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span className="truncate">
              {selectedUser.name || selectedUser.email}
            </span>
          </>
        ) : (
          <span style={{ color: "var(--muted)" }}>Empty</span>
        )}
      </button>
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] mt-1 rounded-lg shadow-2xl py-1 max-h-60 overflow-y-auto"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 25px 50px -12px var(--shadow)",
            }}
          >
            {/* Empty option */}
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 transition-colors text-xs"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--card-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Empty
            </button>

            {/* User options */}
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  onChange(user.email);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 transition-colors flex items-center gap-2"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--foreground)" }}
                  >
                    {user.name || user.email}
                  </span>
                  {user.name && (
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--muted)" }}
                    >
                      {user.email}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: session } = useSession();

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editingSubgroupId, setEditingSubgroupId] = useState<string | null>(
    null
  );
  const [editingSubgroupTitle, setEditingSubgroupTitle] = useState("");
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [projectMembers, setProjectMembers] = useState<IUser[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  // Track local edits for task fields (only save on blur)
  const [localTaskEdits, setLocalTaskEdits] = useState<Record<string, string>>(
    {}
  );

  // Fetch project data and users
  useEffect(() => {
    fetchProject();
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setProjectName(data.project.name);

        // Fetch member details after getting project
        await fetchProjectMembers(data.project.members || []);
      } else {
        console.error("Failed to fetch project");
        router.push("/home");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProjectMembers = async (members: IMember[]) => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        const allUsers: IUser[] = data.users || [];

        // Filter users who are members of this project
        const memberUsers = allUsers.filter((user) =>
          members.some((member) => member.userId === user.email)
        );

        setProjectMembers(memberUsers);
      }
    } catch (error) {
      console.error("Error fetching project members:", error);
    }
  };

  const updateProject = async (updatedData: Partial<IProject>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleSaveProjectName = () => {
    if (projectName.trim()) {
      updateProject({ name: projectName });
      setEditingTitle(false);
    }
  };

  const handleAddSubgroup = () => {
    if (!project) return;

    const newSubgroup: ISubgroup = {
      id: `subgroup-${Date.now()}`,
      title: "Untitled Subgroup",
      tasks: [
        {
          id: `task-${Date.now()}`,
          task: "",
          assignedTo: "",
          deadline: null,
          status: "",
          priority: "",
          comment: "",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSubgroups = [...project.subgroups, newSubgroup];
    updateProject({ subgroups: updatedSubgroups });
  };

  const handleDeleteSubgroup = (subgroupId: string) => {
    if (!project) return;

    const updatedSubgroups = project.subgroups.filter(
      (sg) => sg.id !== subgroupId
    );
    updateProject({ subgroups: updatedSubgroups });
  };

  const handleSaveSubgroupTitle = (subgroupId: string) => {
    if (!project) return;

    const updatedSubgroups = project.subgroups.map((sg) =>
      sg.id === subgroupId
        ? { ...sg, title: editingSubgroupTitle, updatedAt: new Date() }
        : sg
    );

    updateProject({ subgroups: updatedSubgroups });
    setEditingSubgroupId(null);
  };

  const handleAddTask = (subgroupId: string) => {
    if (!project) return;

    const newTask: ITask = {
      id: `task-${Date.now()}`,
      task: "",
      assignedTo: "",
      deadline: null,
      status: "",
      priority: "",
      comment: "",
    };

    const updatedSubgroups = project.subgroups.map((sg) =>
      sg.id === subgroupId
        ? { ...sg, tasks: [...sg.tasks, newTask], updatedAt: new Date() }
        : sg
    );

    updateProject({ subgroups: updatedSubgroups });
  };

  const handleDeleteTask = (subgroupId: string, taskId: string) => {
    if (!project) return;

    const updatedSubgroups = project.subgroups.map((sg) =>
      sg.id === subgroupId
        ? {
            ...sg,
            tasks: sg.tasks.filter((t) => t.id !== taskId),
            updatedAt: new Date(),
          }
        : sg
    );

    updateProject({ subgroups: updatedSubgroups });
  };

  const sendInvitationToUser = async () => {
    if (!inviteEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    setSendingInvite(true);
    try {
      const response = await fetch(`/api/invitations/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, userEmail: inviteEmail }),
      });

      if (response.ok) {
        alert(`Invitation sent to ${inviteEmail}!`);
        setInviteEmail("");
      } else {
        const errorData = await response.json();
        if (errorData.error === "User is already a member of this project") {
          alert("This user is already a member of this project");
        } else if (
          errorData.error === "An invitation has already been sent to this user"
        ) {
          alert("An invitation has already been sent to this user");
        } else if (errorData.error === "User not found") {
          alert("No user found with this email address");
        } else {
          alert(
            `Failed to send invitation: ${errorData.error || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation. Please try again.");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRemoveMember = async (userEmail: string) => {
    if (
      !confirm(`Are you sure you want to remove this member from the project?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/members?userEmail=${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Member removed successfully!");
        // Refresh the project and members list
        await fetchProject();
      } else {
        const errorData = await response.json();
        alert(`Failed to remove member: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const handleUpdateTask = (
    subgroupId: string,
    taskId: string,
    field: keyof ITask,
    value: string | Date | null
  ) => {
    if (!project) return;

    const updatedSubgroups = project.subgroups.map((sg) =>
      sg.id === subgroupId
        ? {
            ...sg,
            tasks: sg.tasks.map((t) =>
              t.id === taskId ? { ...t, [field]: value } : t
            ),
            updatedAt: new Date(),
          }
        : sg
    );

    updateProject({ subgroups: updatedSubgroups });
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
            Loading project...
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="text-lg" style={{ color: "var(--muted)" }}>
          Project not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-3 sm:p-6 relative"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <button
            onClick={() => router.push("/home")}
            className="mb-4 sm:mb-6 flex items-center gap-2 transition-colors group text-sm sm:text-base"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            {editingTitle ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-2xl sm:text-4xl md:text-5xl font-bold border-b-2 bg-transparent outline-none flex-1"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--foreground)",
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveProjectName}
                  className="p-2 sm:p-3 rounded-xl transition-all"
                  style={{
                    color: "var(--success)",
                    border: "1px solid var(--success)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(5, 150, 105, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiSave size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
                <button
                  onClick={() => {
                    setProjectName(project.name);
                    setEditingTitle(false);
                  }}
                  className="p-2 sm:p-3 rounded-xl transition-all"
                  style={{
                    color: "var(--error)",
                    border: "1px solid var(--error)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(220, 38, 38, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiX size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {project.name}
                </h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-2 sm:p-3 rounded-xl transition-all"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.background = "var(--card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <FiEdit2 size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>
            )}
          </div>

          {project.description && (
            <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Members Section */}
        <div
          className="mb-8 rounded-xl shadow-lg p-6"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiUsers size={24} style={{ color: "var(--primary)" }} />
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Project Members
              </h2>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                }}
              >
                {projectMembers.length}
              </span>
            </div>
            <button
              onClick={() => setShowMembersModal(!showMembersModal)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FiMail size={18} />
              Invite Member
            </button>
          </div>

          {/* Invite Form */}
          {showMembersModal && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Invite by Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="flex-1 px-4 py-2 rounded-lg outline-none"
                  style={{
                    background: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendInvitationToUser();
                    }
                  }}
                />
                <button
                  onClick={sendInvitationToUser}
                  disabled={sendingInvite}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{
                    background: "var(--success)",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) =>
                    !sendingInvite && (e.currentTarget.style.opacity = "0.9")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <FiSend size={18} />
                  {sendingInvite ? "Sending..." : "Send Invite"}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                User will receive an email invitation to join this project
              </p>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-2">
            {projectMembers.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: "var(--muted)" }}>
                  No members yet. Invite someone to get started!
                </p>
              </div>
            ) : (
              projectMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--card-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--input-bg)")
                  }
                >
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name || member.email}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <p
                      className="font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {member.name || member.email}
                    </p>
                    {member.name && (
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {member.email}
                      </p>
                    )}
                  </div>
                  {project.userId === member.email ? (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "var(--primary)",
                        color: "#ffffff",
                      }}
                    >
                      Owner
                    </span>
                  ) : (
                    // Show remove button only if current user is the owner
                    session?.user?.email === project.userId && (
                      <button
                        onClick={() => handleRemoveMember(member.email)}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          color: "var(--error)",
                          border: "1px solid var(--error)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(220, 38, 38, 0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        title="Remove member"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subgroups */}
        <div className="space-y-4 sm:space-y-8">
          {project.subgroups.map((subgroup) => (
            <div
              key={subgroup.id}
              className="rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 transition-all"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                boxShadow: "0 25px 50px -12px var(--shadow)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              {/* Subgroup Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                {editingSubgroupId === subgroup.id ? (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <input
                      type="text"
                      value={editingSubgroupTitle}
                      onChange={(e) => setEditingSubgroupTitle(e.target.value)}
                      className="text-xl sm:text-2xl md:text-3xl font-bold border-b-2 bg-transparent outline-none"
                      style={{
                        borderColor: "var(--primary)",
                        color: "var(--foreground)",
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveSubgroupTitle(subgroup.id)}
                      className="p-2 rounded-lg transition-all shrink-0"
                      style={{
                        color: "var(--success)",
                        border: "1px solid var(--success)",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(5, 150, 105, 0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <FiSave size={16} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setEditingSubgroupId(null)}
                      className="p-2 rounded-lg transition-all shrink-0"
                      style={{
                        color: "var(--error)",
                        border: "1px solid var(--error)",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(220, 38, 38, 0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <FiX size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold truncate"
                      style={{ color: "var(--foreground)" }}
                    >
                      {subgroup.title}
                    </h2>
                    <button
                      onClick={() => {
                        setEditingSubgroupId(subgroup.id);
                        setEditingSubgroupTitle(subgroup.title);
                      }}
                      className="p-2 rounded-lg transition-all shrink-0"
                      style={{ color: "var(--muted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--primary)";
                        e.currentTarget.style.background = "var(--card-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <FiEdit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteSubgroup(subgroup.id)}
                  className="p-2 sm:p-3 rounded-xl transition-all shrink-0"
                  style={{
                    color: "var(--error)",
                    border: "1px solid var(--error)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(220, 38, 38, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiTrash2 size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Scroll hint for mobile */}
              <div
                className="md:hidden text-center text-xs mb-2 flex items-center justify-center gap-1"
                style={{ color: "var(--muted)" }}
              >
                <span>←</span>
                <span>Scroll to see all columns</span>
                <span>→</span>
              </div>

              {/* Notion-Style Table */}
              <div
                className="overflow-x-auto rounded-xl -mx-4 sm:mx-0"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--input-bg)",
                }}
              >
                <div className="min-w-[900px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr
                        style={{
                          background: "var(--card-bg)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiFileText
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Task</span>
                          </div>
                        </th>
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm w-32 sm:w-40"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiCheckCircle
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Status</span>
                          </div>
                        </th>
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm w-28 sm:w-36"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiAlertCircle
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Priority</span>
                          </div>
                        </th>
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm w-36 sm:w-44"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiUser
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Assigned To</span>
                          </div>
                        </th>
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm w-32 sm:w-40"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiCalendar
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Deadline</span>
                          </div>
                        </th>
                        <th
                          className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm w-44 sm:w-56"
                          style={{ color: "var(--muted)" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiMessageSquare
                              style={{ color: "var(--primary)" }}
                              size={14}
                            />
                            <span>Comment</span>
                          </div>
                        </th>
                        <th className="w-10 sm:w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subgroup.tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="transition-colors group"
                          style={{ borderBottom: "1px solid var(--border)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--card-hover)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td className="p-2 sm:p-3">
                            <input
                              type="text"
                              value={
                                localTaskEdits[`${task.id}-task`] ?? task.task
                              }
                              onChange={(e) => {
                                setLocalTaskEdits({
                                  ...localTaskEdits,
                                  [`${task.id}-task`]: e.target.value,
                                });
                              }}
                              onBlur={(e) => {
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "task",
                                  e.target.value
                                );
                                // Clear local edit after saving
                                const newEdits = { ...localTaskEdits };
                                delete newEdits[`${task.id}-task`];
                                setLocalTaskEdits(newEdits);
                                e.currentTarget.style.background =
                                  "transparent";
                              }}
                              placeholder="Empty"
                              className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg transition-all text-xs sm:text-sm"
                              style={{
                                color: "var(--foreground)",
                                caretColor: "var(--primary)",
                              }}
                              onFocus={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--card-hover)")
                              }
                              onMouseEnter={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "var(--card-hover)")
                                  : null
                              }
                              onMouseLeave={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "transparent")
                                  : null
                              }
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <StatusDropdown
                              value={task.status}
                              onChange={(value) =>
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "status",
                                  value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <PriorityDropdown
                              value={task.priority}
                              onChange={(value) =>
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "priority",
                                  value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <AssignedToDropdown
                              value={task.assignedTo}
                              onChange={(value) =>
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "assignedTo",
                                  value
                                )
                              }
                              users={projectMembers}
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="date"
                              value={
                                task.deadline
                                  ? new Date(task.deadline)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "deadline",
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                              className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg transition-all text-xs sm:text-sm"
                              style={{
                                color: "var(--foreground)",
                                colorScheme: "dark",
                              }}
                              onFocus={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--card-hover)")
                              }
                              onBlur={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                              onMouseEnter={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "var(--card-hover)")
                                  : null
                              }
                              onMouseLeave={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "transparent")
                                  : null
                              }
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="text"
                              value={
                                localTaskEdits[`${task.id}-comment`] ??
                                task.comment
                              }
                              onChange={(e) => {
                                setLocalTaskEdits({
                                  ...localTaskEdits,
                                  [`${task.id}-comment`]: e.target.value,
                                });
                              }}
                              onBlur={(e) => {
                                handleUpdateTask(
                                  subgroup.id,
                                  task.id,
                                  "comment",
                                  e.target.value
                                );
                                // Clear local edit after saving
                                const newEdits = { ...localTaskEdits };
                                delete newEdits[`${task.id}-comment`];
                                setLocalTaskEdits(newEdits);
                                e.currentTarget.style.background =
                                  "transparent";
                              }}
                              placeholder="Add a comment..."
                              className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg transition-all text-xs sm:text-sm"
                              style={{
                                color: "var(--foreground)",
                                caretColor: "var(--primary)",
                              }}
                              onFocus={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--card-hover)")
                              }
                              onMouseEnter={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "var(--card-hover)")
                                  : null
                              }
                              onMouseLeave={(e) =>
                                !document.activeElement ||
                                document.activeElement !== e.currentTarget
                                  ? (e.currentTarget.style.background =
                                      "transparent")
                                  : null
                              }
                            />
                          </td>
                          <td className="p-2 sm:p-3 text-center">
                            <button
                              onClick={() =>
                                handleDeleteTask(subgroup.id, task.id)
                              }
                              className="p-1.5 sm:p-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                              style={{ color: "var(--muted)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "var(--error)";
                                e.currentTarget.style.background =
                                  "rgba(220, 38, 38, 0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--muted)";
                                e.currentTarget.style.background =
                                  "transparent";
                              }}
                              title="Delete task"
                            >
                              <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => handleAddTask(subgroup.id)}
                className="mt-4 sm:mt-5 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base"
                style={{
                  color: "var(--primary)",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-hover)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <FiPlus size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">Add Task</span>
              </button>
            </div>
          ))}
        </div>

        {/* Add Subgroup Button */}
        <button
          onClick={handleAddSubgroup}
          className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold hover:scale-105 active:scale-95 text-sm sm:text-base"
          style={{
            background: "var(--primary)",
            color: "#ffffff",
            boxShadow: "0 10px 15px -3px var(--shadow)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--primary)")
          }
        >
          <FiPlus size={20} className="sm:w-[22px] sm:h-[22px]" />
          Add Subgroup
        </button>
      </div>
    </div>
  );
}
