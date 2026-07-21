import Logo from "../common/Logo";
import Container from "../common/Container";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/15 bg-[#161b26]/90 py-10 text-slate-300 backdrop-blur-xl shadow-2xl">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo />

        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <a href="#features" className="hover:text-cyan-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-300 transition-colors">Workflow</a>
        </div>

        <p className="text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} BuildPilot AI. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
