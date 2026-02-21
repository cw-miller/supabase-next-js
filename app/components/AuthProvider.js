"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
        if (error) console.error("Google sign-in error:", error.message);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}
