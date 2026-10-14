import "./App.css";
import { ToastContainer } from "react-toastify";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/login";
import Productions from "./pages/productions/productions";

function ProtectedRoute({ children }: { children: ReactNode }) {
  return localStorage.getItem("user") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function GuestRoute({ children }: { children: ReactNode }) {
  return localStorage.getItem("user") ? (
    <Navigate to="/productions" replace />
  ) : (
    children
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/productions"
          element={
            <ProtectedRoute>
              <Productions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
