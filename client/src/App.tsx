import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Main app layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path=":chatId" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
