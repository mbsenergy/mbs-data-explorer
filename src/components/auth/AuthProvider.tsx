import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }

        if (session?.user) {
          setUser(session.user);
          // Only redirect if on public routes
          if (location.pathname === '/' || location.pathname === '/login') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setUser(null);
          // Clear any stale auth data
          localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
          
          if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/resetpassword') {
            navigate('/login', { replace: true });
          }
        }
      } catch (error: any) {
        console.error("Error checking session:", error);
        // Clear any stale auth data
        localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
        setUser(null);
        
        toast({
          title: "Session Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        
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
          if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            // Clear auth-related items from localStorage
            localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
            navigate('/login', { replace: true });
          }
        }
        
        // Handle specific auth events
        switch (event) {
          case 'TOKEN_REFRESHED':
            console.log('Token was refreshed successfully');
            break;
          case 'SIGNED_OUT':
            toast({
              title: "Signed Out",
              description: "You have been signed out successfully.",
            });
            break;
          case 'USER_DELETED':
            toast({
              title: "Account Deleted",
              description: "Your account has been deleted.",
              variant: "destructive"
            });
            break;
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};