"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else {
                setMessage("Check your email for the confirmation link!");
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            } else {
                router.push("/");
            }
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-10 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl text-white font-bold mx-auto mb-4">
                        ✓
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {isSignUp
                            ? "Sign up to start managing your todos"
                            : "Sign in to your todo list"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-slate-400">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-slate-400">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-2.5 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3.5 py-2.5 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-3 text-sm font-semibold cursor-pointer hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-1"
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : isSignUp
                                ? "Create Account"
                                : "Sign In"}
                    </button>
                </form>

                {/* Switch */}
                <div className="text-center mt-6 text-sm text-slate-400">
                    <span>
                        {isSignUp
                            ? "Already have an account?"
                            : "Don't have an account?"}
                    </span>
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setMessage("");
                        }}
                        className="bg-transparent border-none text-indigo-400 hover:underline cursor-pointer font-semibold ml-1 text-sm"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
