"use client";

import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusModal } from "@/components/StatusModal";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:5224/api/v1/register", {
        username,
        email,
        password,
      });
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4EE] p-4 font-body">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border-2 border-[#E0DFD7]">
        <div className="flex justify-center mb-8">
          <Image src="/Logo.png" alt="Logo" width={180} height={45} />
        </div>
        
        <h2 className="mb-2 text-center text-3xl font-bold text-dark-1 font-heading">
          Create Account
        </h2>
        <p className="mb-8 text-center text-dark-3 text-sm">
          Join Acceloka to explore more experiences
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error text-error text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="mb-2 block text-sm font-bold text-dark-1 font-mono uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-5 py-3 rounded-full border-2 border-dark-4/30 focus:border-primary outline-none transition-all text-dark-1 placeholder:text-dark-4/50"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Sign Up
            </button>
          </div>
          
          <div className="text-center pt-2">
            <span className="text-dark-3 text-sm">Already have an account? </span>
            <Link href="/auth/login" className="text-sm font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>

      <StatusModal
        isOpen={showSuccess}
        type="success"
        title="Account Created!"
        message="Your account has been registered successfully. You can now log in to your account."
        onClose={handleCloseSuccess}
      />
    </div>
  );
}
