"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="space-y-4">
          <button
            onClick={() => alert("Add new project logic goes here!")}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            ➕ Add New Project
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
