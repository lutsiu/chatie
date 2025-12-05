import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import Protected from "./components/Protected";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Protected app */}
        <Route path="/" element={<Protected><MainLayout /></Protected>}>
          <Route index element={<HomePage />} />
          <Route path=":chatId" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <Toaster richColors theme="dark" position="top-right" closeButton
        toastOptions={{ style: { fontSize: "1.4rem", lineHeight: 1.3 } }} />
    </>
  );
}
