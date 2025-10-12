"use client";

import React from "react";
import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Eventura</h1>
        <p className="text-gray-600 mb-6">Your gateway to amazing events!</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/signin" })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
