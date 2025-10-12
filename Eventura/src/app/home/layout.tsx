"use client";
import React, { useState } from "react";

export default function HomePage() {
  const [projects, setProjects] = useState<string[]>([]);

  const handleAddProject = () => {
    const newProject = `Project ${projects.length + 1}`;
    setProjects([...projects, newProject]);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-6">My Projects</h1>

        {/* GRID CONTAINER */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* PROJECT CARDS */}
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-blue-100 p-4 rounded-lg shadow text-gray-700 font-medium flex items-center justify-center h-32"
            >
              {project}
            </div>
          ))}

          {/* ADD NEW PROJECT BUTTON */}
          <button
            onClick={handleAddProject}
            className="bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition h-32 flex items-center justify-center text-lg font-semibold"
          >
            ➕ Add New Project
          </button>
        </div>
      </div>
    </main>
  );
}
