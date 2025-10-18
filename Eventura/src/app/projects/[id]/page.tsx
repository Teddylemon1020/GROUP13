"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";

interface ITask {
  id: string;
  task: string;
  assignedTo: string;
  deadline: Date | null;
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

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Task
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Assigned To
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Deadline
                      </th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subgroup.tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3">
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
                            placeholder="Enter task..."
                            className="w-full bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 rounded"
                          />
                        </td>
                        <td className="p-3">
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
                            placeholder="Assign to..."
                            className="w-full bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 rounded"
                          />
                        </td>
                        <td className="p-3">
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
                            className="w-full bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 rounded"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              handleDeleteTask(subgroup.id, task.id)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 size={16} />
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
