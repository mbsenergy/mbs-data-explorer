import { NewPasswordForm } from "@/components/auth/NewPasswordForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Animated background shapes */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-corporate-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-corporate-teal rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />

      {/* Logo */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mb-6">
        <img 
          src="/brand/mbs_logo.png" 
          alt="MBS Logo" 
          className="h-20"
        />
      </div>
      
      <div className="w-full max-w-md p-8 metallic-card relative z-10 shimmer">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;