
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback values for development - ONLY USE IN DEV MODE
const fallbackUrl = "https://your-project-ref.supabase.co";
const fallbackKey = "your-anon-key-placeholder";

// Use fallbacks only if env variables are missing
const safeSupabaseUrl = supabaseUrl || fallbackUrl;
const safeSupabaseAnonKey = supabaseAnonKey || fallbackKey;

type SupabaseContext = {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContext | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast: uiToast } = useToast();

  // Create Supabase client safely
  const supabase = createClient(safeSupabaseUrl, safeSupabaseAnonKey);

  // Check if the environment variables are missing and show a warning
  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        "Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing. " +
        "Using fallback values. Please set these variables for proper functionality."
      );
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      uiToast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      uiToast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      uiToast({
        title: "Account created!",
        description: "Please check your email for verification.",
      });
    } catch (error: any) {
      uiToast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      uiToast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      uiToast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    supabase,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
