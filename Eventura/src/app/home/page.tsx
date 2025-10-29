"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPlus, FiFolder, FiLogOut } from "react-icons/fi";

interface IProject {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
    } else if (status === "authenticated") {
      fetchProjects();
    }
  }, [status, router]);

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

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-lg text-gray-400">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-6 relative">
      {/* Gradient background effect */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Welcome back, <span className="text-indigo-400 font-semibold">{session?.user?.name || "User"}</span>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-5 py-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-all duration-200 hover:border-red-500/50 hover:scale-105 active:scale-95"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Create Project Button */}
        <button
          onClick={handleCreateProject}
          disabled={creatingProject}
          className="mb-8 flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
        >
          <FiPlus size={22} />
          {creatingProject ? "Creating..." : "Create New Project"}
        </button>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
              <div className="text-6xl">📋</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-3">
              No projects yet
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Create your first project to get started
            </p>
            <button
              onClick={handleCreateProject}
              disabled={creatingProject}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
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
                onClick={() => router.push(`/projects/${project._id}`)}
                className="group bg-[#161616] rounded-xl shadow-lg border border-[#2a2a2a] p-6 hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                    <FiFolder size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-200 truncate group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-[#2a2a2a]">
                  <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
