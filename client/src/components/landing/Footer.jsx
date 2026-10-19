const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-line pb-10 pt-8 text-sm text-muted">
      <span className="font-semibold text-fg">BuildPilot AI</span>
      <span>© {new Date().getFullYear()} BuildPilot AI. All rights reserved.</span>
    </footer>
  );
};

export default Footer;
