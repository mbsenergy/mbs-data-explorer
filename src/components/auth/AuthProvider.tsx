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
    let mounted = true;

    // Check active sessions
    const initializeAuth = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }

        console.log("Session check result:", session ? "Session found" : "No session");
        
        if (session?.user && mounted) {
          setUser(session.user);
        } else {
          if (mounted) {
            setUser(null);
            // Only clear tokens if we're sure there's no session
            localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        
        if (event === "SIGNED_OUT") {
          if (mounted) {
            console.log("User signed out, clearing state and redirecting...");
            setUser(null);
            // Clear auth-related items from localStorage
            localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
            navigate("/login");
          }
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (mounted && session?.user) {
            console.log("User signed in or token refreshed, updating state...");
            setUser(session.user);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Cleanup function
    return () => {
      console.log("Cleaning up auth subscriptions");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};