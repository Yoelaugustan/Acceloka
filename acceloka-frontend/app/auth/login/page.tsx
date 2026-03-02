"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("http://localhost:5224/api/v1/login", {
        username,
        password,
      });

      if (response.data.token) {
        login(response.data.token, username);
        router.push("/tickets");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during login.",
      );
    }
  };

    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4 font-body">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border-2 border-[#E0DFD7]">
          <div className="flex justify-center mb-8">
            <Image src="/Logo.png" alt="Logo" width={180} height={45} />
          </div>
          
          <h2 className="mb-2 text-center text-3xl font-bold text-dark-1 font-heading">
            Welcome Back
          </h2>
          <p className="mb-8 text-center text-dark-3 text-sm">
            Please enter your details to sign in
          </p>
  
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error text-error text-sm text-center font-bold">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-dark-1 font-mono uppercase tracking-wider" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-5 py-3 rounded-full border-2 border-dark-4/30 focus:border-primary outline-none transition-all text-dark-1 placeholder:text-dark-4/50"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-dark-1 font-mono uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-5 py-3 rounded-full border-2 border-dark-4/30 focus:border-primary outline-none transition-all text-dark-1 placeholder:text-dark-4/50"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                className="w-full rounded-full bg-primary py-3.5 font-bold text-white shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer text-lg"
                type="submit"
              >
                Sign In
              </button>
            </div>
            
            <div className="text-center pt-2">
              <span className="text-dark-3 text-sm">Don't have an account? </span>
              <Link href="/auth/register" className="text-sm font-bold text-primary hover:underline">
                Create an Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
