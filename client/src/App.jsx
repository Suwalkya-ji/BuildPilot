import AppRoutes from "./routes/AppRoutes";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";
import { Toaster } from "sonner";

function App() {
  return (
    <GlobalErrorBoundary>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--fg)",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 500,
          },
        }}
      />
      <AppRoutes />
    </GlobalErrorBoundary>
  );
}

export default App;
