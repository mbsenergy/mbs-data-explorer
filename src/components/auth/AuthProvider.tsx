import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  role: string | null;
  company: string | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      console.log("Profile data loaded:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check active sessions
    const initializeAuth = async () => {
      try {
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check result:", session ? "Session found" : "No session");
        
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
        setProfile(null);
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
          setProfile(null);
          // Clear auth-related items from localStorage
          localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
          navigate("/login");
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log("User signed in or token refreshed, updating state...");
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
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
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};