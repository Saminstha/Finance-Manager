import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "@/components/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Budgets from "@/pages/Budgets";
import Accounts from "@/pages/Accounts";
import Savings from "@/pages/Savings";

import LoginPage from "@/auth/LoginPage";
import SignupPage from "@/auth/SignupPage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AuthInit from "@/auth/AuthInit";

function App() {
  return (
    <BrowserRouter>
      <AuthInit>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<SignupPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

              <Route path="/transactions" element={<Transactions />} />

              <Route path="/budgets" element={<Budgets />} />

              <Route path="/accounts" element={<Accounts />} />

              <Route path="/savings" element={<Savings />} />
            </Route>
          </Route>
        </Routes>
      </AuthInit>
    </BrowserRouter>
  );
}

export default App;
