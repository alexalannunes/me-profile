import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/login.tsx";
import { HomePage } from "./pages/home/home.tsx";
import { MePage } from "./pages/me/me.tsx";
import { DashboardPage } from "./pages/dashboard/dashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:username" element={<MePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<App />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
