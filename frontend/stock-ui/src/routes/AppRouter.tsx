import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MainLayout from "../layouts/MainLayout";
import ProductPage from "../pages/ProductPage";
import PawnPage from "../pages/PawnPage";
import CustomerPage from "../pages/CustomerPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import UserPage from "../pages/UserPage";
import EmployeePage from "../pages/EmployeePage";
import PawnDetailPage from "../pages/PawnDetailPage";
import ReportPage from "../pages/ReportPage";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/pawn" element={<PawnPage />} />
          <Route path="/pawn/:id" element={<PawnDetailPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route
            path="/customers/detail/:id"
            element={<CustomerDetailPage />}
          />
          <Route path="/users" element={<UserPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
