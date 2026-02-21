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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">✓</div>
                    <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
                    <p className="auth-subtitle">
                        {isSignUp
                            ? "Sign up to start managing your todos"
                            : "Sign in to your todo list"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading
                            ? "Loading..."
                            : isSignUp
                                ? "Create Account"
                                : "Sign In"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setMessage("");
                        }}
                        className="auth-switch-btn"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
