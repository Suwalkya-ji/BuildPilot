import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0d13] px-4 py-12 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background Neon Glowing Orbs matching reference image */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Centered Translucent Glassmorphic Card Container matching reference image */}
      <main className="w-full max-w-md rounded-3xl border border-cyan-400/40 bg-[#131722]/80 p-8 sm:p-10 shadow-[0_0_50px_rgba(34,211,238,0.2)] backdrop-blur-2xl transition-all duration-300">
        {/* Centered Logo */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
        © {new Date().getFullYear()} BuildPilot AI. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
