"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface IProject {
  _id: string;
  name: string;
  description?: string;
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectedOption = statusOptions.find((opt) => opt.value === value) || statusOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 ${
          selectedOption.color
        } ${!value && "text-gray-500"}`}
      >
        {selectedOption.label}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl py-1 min-w-[140px]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value as any);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] transition-colors"
            >
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${option.color}`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorityOptions = [
    { value: "", label: "Empty", color: "bg-gray-700/50 text-gray-400", icon: "○" },
    { value: "high", label: "High", color: "bg-red-500/20 text-red-400", icon: "●" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-500/20 text-yellow-400",
      icon: "●",
    },
    { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-400", icon: "●" },
  ];

  const selectedOption = priorityOptions.find((opt) => opt.value === value) || priorityOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 flex items-center gap-1 ${
          selectedOption.color
        } ${!value && "text-gray-500"}`}
      >
        <span>{selectedOption.icon}</span>
        <span>{selectedOption.label}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl py-1 min-w-[130px]">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value as any);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] transition-colors"
            >
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${option.color}`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </button>
          ))}
        </div>
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((user) => user.email === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#2a2a2a] bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] min-w-[140px] text-left flex items-center gap-2"
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
          <span className="text-gray-500">Empty</span>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl py-1 min-w-[200px] max-h-60 overflow-y-auto">
          {/* Empty option */}
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] transition-colors text-gray-500 text-xs"
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
              className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
            >
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || user.email}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm text-gray-300 truncate">
                  {user.name || user.email}
                </span>
                {user.name && (
                  <span className="text-xs text-gray-500 truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editingSubgroupId, setEditingSubgroupId] = useState<string | null>(null);
  const [editingSubgroupTitle, setEditingSubgroupTitle] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  // Fetch project data and users
  useEffect(() => {
    fetchProject();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setProjectName(data.project.name);
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

  const fetchUsers = async () => {
    try {
      console.log("🔍 Fetching users...");
      const response = await fetch("/api/users");
      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Users fetched:", data.users);
        console.log("📊 Number of users:", data.users?.length);
        setUsers(data.users || []);
      } else {
        console.error("❌ Failed to fetch users. Status:", response.status);
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("💥 Error fetching users:", error);
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

  const assignUserToProject = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        console.log(`✅ User ${userEmail} added as project member`);
      } else {
        const errorData = await response.json();
        // Silently handle if user is already a member
        if (errorData.error === "User is already a member of this project") {
          console.log(`ℹ️ User ${userEmail} is already a member`);
        } else {
          console.error("Failed to add user as member:", errorData);
        }
      }
    } catch (error) {
      console.error("Error adding user as member:", error);
    }
  };

  const handleUpdateTask = (
    subgroupId: string,
    taskId: string,
    field: keyof ITask,
    value: string | Date | null
  ) => {
    if (!project) return;

    // If assigning a task to a user, automatically add them as a project member
    if (field === "assignedTo" && value && typeof value === "string") {
      assignUserToProject(value);
    }

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-lg text-gray-400">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-lg text-gray-400">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-3 sm:p-6 relative">
      {/* Gradient background effect */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <button
            onClick={() => router.push("/home")}
            className="text-gray-400 hover:text-indigo-400 mb-4 sm:mb-6 flex items-center gap-2 transition-colors group text-sm sm:text-base"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            {editingTitle ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-2xl sm:text-4xl md:text-5xl font-bold border-b-2 border-indigo-500 bg-transparent outline-none flex-1 text-gray-200"
                  autoFocus
                />
                <button
                  onClick={handleSaveProjectName}
                  className="p-2 sm:p-3 text-green-400 hover:bg-green-500/10 border border-green-500/30 rounded-xl transition-all hover:border-green-500/50"
                >
                  <FiSave size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
                <button
                  onClick={() => {
                    setProjectName(project.name);
                    setEditingTitle(false);
                  }}
                  className="p-2 sm:p-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-all hover:border-red-500/50"
                >
                  <FiX size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-2 sm:p-3 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                >
                  <FiEdit2 size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>
            )}
          </div>

          {project.description && (
            <p className="text-gray-400 mt-4 text-lg">{project.description}</p>
          )}
        </div>

        {/* Subgroups */}
        <div className="space-y-4 sm:space-y-8">
          {project.subgroups.map((subgroup) => (
            <div
              key={subgroup.id}
              className="bg-[#161616] rounded-xl sm:rounded-2xl shadow-2xl border border-[#2a2a2a] p-4 sm:p-8 hover:border-indigo-500/30 transition-all"
            >
              {/* Subgroup Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                {editingSubgroupId === subgroup.id ? (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <input
                      type="text"
                      value={editingSubgroupTitle}
                      onChange={(e) => setEditingSubgroupTitle(e.target.value)}
                      className="text-xl sm:text-2xl md:text-3xl font-bold border-b-2 border-indigo-500 bg-transparent outline-none text-gray-200"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveSubgroupTitle(subgroup.id)}
                      className="p-2 text-green-400 hover:bg-green-500/10 border border-green-500/30 rounded-lg transition-all shrink-0"
                    >
                      <FiSave size={16} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setEditingSubgroupId(null)}
                      className="p-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all shrink-0"
                    >
                      <FiX size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-200 truncate">
                      {subgroup.title}
                    </h2>
                    <button
                      onClick={() => {
                        setEditingSubgroupId(subgroup.id);
                        setEditingSubgroupTitle(subgroup.title);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all shrink-0"
                    >
                      <FiEdit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteSubgroup(subgroup.id)}
                  className="p-2 sm:p-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-all hover:border-red-500/50 shrink-0"
                >
                  <FiTrash2 size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Scroll hint for mobile */}
              <div className="md:hidden text-center text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
                <span>←</span>
                <span>Scroll to see all columns</span>
                <span>→</span>
              </div>

              {/* Notion-Style Table */}
              <div className="overflow-x-auto rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] -mx-4 sm:mx-0">
                <div className="min-w-[900px]">
                  <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#1f1f1f] border-b border-[#2a2a2a]">
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiFileText className="text-indigo-400" size={14} />
                          <span>Task</span>
                        </div>
                      </th>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm w-32 sm:w-40">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiCheckCircle className="text-indigo-400" size={14} />
                          <span>Status</span>
                        </div>
                      </th>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm w-28 sm:w-36">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiAlertCircle className="text-indigo-400" size={14} />
                          <span>Priority</span>
                        </div>
                      </th>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm w-36 sm:w-44">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiUser className="text-indigo-400" size={14} />
                          <span>Assigned To</span>
                        </div>
                      </th>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm w-32 sm:w-40">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiCalendar className="text-indigo-400" size={14} />
                          <span>Deadline</span>
                        </div>
                      </th>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-400 text-xs sm:text-sm w-44 sm:w-56">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiMessageSquare className="text-indigo-400" size={14} />
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
                        className="border-b border-[#2a2a2a] hover:bg-[#1f1f1f] transition-colors group"
                      >
                        <td className="p-2 sm:p-3">
                          <input
                            type="text"
                            value={task.task}
                            onChange={(e) =>
                              handleUpdateTask(
                                subgroup.id,
                                task.id,
                                "task",
                                e.target.value
                              )
                            }
                            placeholder="Empty"
                            className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-all text-xs sm:text-sm text-gray-300 placeholder-gray-600"
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
                            users={users}
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
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                            className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-all text-xs sm:text-sm text-gray-300 placeholder-gray-600"
                          />
                        </td>
                        <td className="p-2 sm:p-3">
                          <input
                            type="text"
                            value={task.comment}
                            onChange={(e) =>
                              handleUpdateTask(
                                subgroup.id,
                                task.id,
                                "comment",
                                e.target.value
                              )
                            }
                            placeholder="Add a comment..."
                            className="w-full bg-transparent border-none outline-none px-2 sm:px-3 py-2 rounded-lg hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-all text-xs sm:text-sm text-gray-300 placeholder-gray-600"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-center">
                          <button
                            onClick={() =>
                              handleDeleteTask(subgroup.id, task.id)
                            }
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
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
                className="mt-4 sm:mt-5 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all border border-transparent hover:border-indigo-500/30 text-sm sm:text-base"
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
          className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <FiPlus size={20} className="sm:w-[22px] sm:h-[22px]" />
          Add Subgroup
        </button>
      </div>
    </div>
  );
}
