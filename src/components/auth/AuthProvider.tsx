import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    // Check active sessions
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Only redirect if on public routes
          if (location.pathname === '/' || location.pathname === '/login') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setUser(null);
          if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/resetpassword') {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
            // Clear auth-related items from localStorage
            localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
            navigate('/login', { replace: true });
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};