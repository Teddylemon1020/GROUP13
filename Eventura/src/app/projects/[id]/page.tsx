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
} from "react-icons/fi";

interface ITask {
  id: string;
  task: string;
  assignedTo: string;
  deadline: Date | null;
  status: "todo" | "in-progress" | "done" | "";
  priority: "high" | "medium" | "low" | "";
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
    { value: "", label: "Empty", color: "bg-gray-100 text-gray-600" },
    { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-700" },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700",
    },
    { value: "done", label: "Done", color: "bg-green-100 text-green-700" },
  ];

  const selectedOption = statusOptions.find((opt) => opt.value === value) || statusOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all hover:opacity-80 ${
          selectedOption.color
        } ${!value && "text-gray-400"}`}
      >
        {selectedOption.label}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value as any);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${option.color}`}
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
    { value: "", label: "Empty", color: "bg-gray-100 text-gray-600", icon: "○" },
    { value: "high", label: "High", color: "bg-red-100 text-red-700", icon: "●" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700",
      icon: "●",
    },
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-700", icon: "●" },
  ];

  const selectedOption = priorityOptions.find((opt) => opt.value === value) || priorityOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all hover:opacity-80 flex items-center gap-1 ${
          selectedOption.color
        } ${!value && "text-gray-400"}`}
      >
        <span>{selectedOption.icon}</span>
        <span>{selectedOption.label}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[130px]">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value as any);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${option.color}`}
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

  // Fetch project data
  useEffect(() => {
    fetchProject();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/home")}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>

          <div className="flex items-center gap-4">
            {editingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-4xl font-bold border-b-2 border-blue-500 bg-transparent outline-none flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSaveProjectName}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <FiSave size={20} />
                </button>
                <button
                  onClick={() => {
                    setProjectName(project.name);
                    setEditingTitle(false);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiX size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-800">
                  {project.name}
                </h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <FiEdit2 size={20} />
                </button>
              </div>
            )}
          </div>

          {project.description && (
            <p className="text-gray-600 mt-2">{project.description}</p>
          )}
        </div>

        {/* Subgroups */}
        <div className="space-y-6">
          {project.subgroups.map((subgroup) => (
            <div
              key={subgroup.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Subgroup Header */}
              <div className="flex items-center justify-between mb-4">
                {editingSubgroupId === subgroup.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingSubgroupTitle}
                      onChange={(e) => setEditingSubgroupTitle(e.target.value)}
                      className="text-2xl font-semibold border-b-2 border-blue-500 bg-transparent outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveSubgroupTitle(subgroup.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <FiSave size={18} />
                    </button>
                    <button
                      onClick={() => setEditingSubgroupId(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {subgroup.title}
                    </h2>
                    <button
                      onClick={() => {
                        setEditingSubgroupId(subgroup.id);
                        setEditingSubgroupTitle(subgroup.title);
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteSubgroup(subgroup.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* Notion-Style Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 font-medium text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-gray-400" size={14} />
                          <span>Task</span>
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600 text-sm w-40">
                        <div className="flex items-center gap-2">
                          <FiCheckCircle className="text-gray-400" size={14} />
                          <span>Status</span>
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600 text-sm w-36">
                        <div className="flex items-center gap-2">
                          <FiAlertCircle className="text-gray-400" size={14} />
                          <span>Priority</span>
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600 text-sm w-44">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" size={14} />
                          <span>Assigned To</span>
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600 text-sm w-40">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" size={14} />
                          <span>Deadline</span>
                        </div>
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subgroup.tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                      >
                        <td className="p-2">
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
                            className="w-full bg-transparent border-none outline-none px-2 py-1.5 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm transition-all text-sm"
                          />
                        </td>
                        <td className="p-2">
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
                        <td className="p-2">
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
                        <td className="p-2">
                          <input
                            type="text"
                            value={task.assignedTo}
                            onChange={(e) =>
                              handleUpdateTask(
                                subgroup.id,
                                task.id,
                                "assignedTo",
                                e.target.value
                              )
                            }
                            placeholder="Empty"
                            className="w-full bg-transparent border-none outline-none px-2 py-1.5 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm transition-all text-sm"
                          />
                        </td>
                        <td className="p-2">
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
                            className="w-full bg-transparent border-none outline-none px-2 py-1.5 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm transition-all text-sm text-gray-700"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() =>
                              handleDeleteTask(subgroup.id, task.id)
                            }
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete task"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => handleAddTask(subgroup.id)}
                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded"
              >
                <FiPlus size={18} />
                Add Task
              </button>
            </div>
          ))}
        </div>

        {/* Add Subgroup Button */}
        <button
          onClick={handleAddSubgroup}
          className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={20} />
          Add Subgroup
        </button>
      </div>
    </div>
  );
}
