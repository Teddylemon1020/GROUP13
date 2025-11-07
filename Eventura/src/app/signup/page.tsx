"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("google", { callbackUrl: "/home" });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="relative p-10 rounded-2xl shadow-2xl w-full max-w-md text-center backdrop-blur-sm"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px var(--shadow)'
        }}
      >
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: 'var(--primary)' }}
          >
            Welcome to Eventura
          </h1>
          <p
            className="text-lg"
            style={{ color: 'var(--muted)' }}
          >
            Your gateway to amazing events!
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg backdrop-blur-sm"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--error)'
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full px-6 py-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: isLoading ? 'var(--muted)' : 'var(--primary)',
            color: '#ffffff',
            boxShadow: '0 10px 15px -3px var(--shadow)'
          }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = 'var(--primary-hover)')}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = 'var(--primary)')}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </span>
          )}
        </button>

        <div className="mt-8 text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </main>
  );
}
