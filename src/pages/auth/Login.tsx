import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="w-full max-w-md p-8 glass-panel rounded-lg shadow-xl bg-[#221F26]/80">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">Welcome to FLUX</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(0, 169, 157)',
                  brandAccent: 'rgb(77, 195, 215)',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#333333',
                  defaultButtonBackgroundHover: '#444444',
                  inputBackground: '#222222',
                  inputBorder: '#333333',
                  inputBorderHover: '#444444',
                  inputBorderFocus: 'rgb(0, 169, 157)',
                },
              },
            },
          }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;