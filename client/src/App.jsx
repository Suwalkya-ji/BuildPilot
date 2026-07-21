import AppRoutes from "./routes/AppRoutes";
import CursorGlow from "./components/common/CursorGlow";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";
import { Toaster } from "sonner";

function App() {
  return (
    <GlobalErrorBoundary>
      <CursorGlow />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#131722",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#e2e8f0",
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: 600,
          },
        }}
      />
      <AppRoutes />
    </GlobalErrorBoundary>
  );
}

export default App;
