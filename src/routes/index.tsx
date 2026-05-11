import { Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "../components/layout/MainLayout";
import { DashboardPage } from "../pages/Dashboard";
import { ReportsPage } from "../pages/Reports";
import { AnalysisPage } from "../pages/Analysis";
import { TalentPage } from "../pages/Talent";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="talent" element={<TalentPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
