//this is an example layout not the default layout for the project
//this is use to help build and understand the programs

"use client";
import React, { useState } from "react";

export default function DemoContainersPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-900 p-6">
      <div className="w-full max-w-5xl border border-gray-300 rounded-xl p-6 bg-white shadow-md relative">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Demo: Container Types
        </h1>

        {/* ======================================================
           1️⃣ MAIN CONTAINER (color shift to show its dimension)
           ====================================================== */}
        {/* 
        <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center rounded-lg text-white font-semibold">
          Main Container (Flex)
        </div>
        */}

        {/* ======================================================
           2️⃣ GRID CONTAINER (show multiple components in grid)
           ====================================================== */}

        {/*  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-red-300 p-4 rounded">Grid Item 1</div>
          <div className="bg-green-300 p-4 rounded">Grid Item 2</div>
          <div className="bg-yellow-300 p-4 rounded">Grid Item 3</div>
          <div className="bg-blue-300 p-4 rounded">Grid Item 4</div>
          <div className="bg-pink-300 p-4 rounded">Grid Item 5</div>
          <div className="bg-purple-300 p-4 rounded">Grid Item 6</div>
        </div> */}

        {/* ======================================================
           3️⃣ RELATIVE CONTAINER (for floating / popup element)
           ====================================================== */}
        {/* 
        <div className="relative w-full h-48 bg-gray-200 rounded-lg mt-6 flex items-center justify-center">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Toggle Popup
          </button>

          {showPopup && (
            <div className="absolute top-4 right-4 bg-white border shadow-md p-4 rounded">
              <p className="text-gray-700 font-medium">I’m a floating popup!</p>
            </div>
          )}
        </div>
        */}

        {/* ======================================================
           4️⃣ SCROLLABLE CONTAINER (corner mini content box)
           ====================================================== */}
        {/* 
        <div className="absolute bottom-4 right-4 w-48 h-32 overflow-y-auto bg-gray-800 text-white p-3 rounded-lg text-sm">
          <p className="font-semibold mb-2">Scrollable Logs:</p>
          <p>Log entry 1</p>
          <p>Log entry 2</p>
          <p>Log entry 3</p>
          <p>Log entry 4</p>
          <p>Log entry 5</p>
          <p>Log entry 6</p>
          <p>Log entry 7</p>
        </div>
        */}
      </div>
    </main>
  );
}
