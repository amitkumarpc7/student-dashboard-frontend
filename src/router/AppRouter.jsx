import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import TransactionDetails from "../pages/TransactionDetails";
import StatusCheck from "../pages/StatusCheck";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/details"
        element={
          <PrivateRoute>
            <TransactionDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/check"
        element={
          <PrivateRoute>
            <StatusCheck />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
