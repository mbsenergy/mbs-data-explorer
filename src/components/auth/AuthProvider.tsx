import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions
    const initializeAuth = async () => {
      try {
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check result:", session ? "Session found" : "No session");
        
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          // Clear any stale tokens
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
        // Clear any stale tokens on error
        await supabase.auth.signOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        
        if (event === "SIGNED_OUT") {
          console.log("User signed out, clearing state and redirecting...");
          setUser(null);
          // Clear auth-related items from localStorage
          localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
          navigate("/login");
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log("User signed in or token refreshed, updating state...");
          if (session?.user) {
            setUser(session.user);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};