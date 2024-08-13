import { NextUIProvider } from "@nextui-org/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { DashboardPage } from "./pages/dashboard/dashboard.tsx";
import { HomePage } from "./pages/home/home.tsx";
import { LoginPage } from "./pages/login/login.tsx";
import { MePage } from "./pages/me/me.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <NextUIProvider>
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
  </NextUIProvider>,
  // </StrictMode>,
);
