import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import AuthProvider from "./components/provider/AuthProvider";
import RestrictedRoute from "./components/provider/RestrictedRoute";
import PrivateRoute from "./components/provider/PrivateRoute";

const LoginPage = lazy(() => import("./screens/auth/Login"));
const RegisterPage = lazy(() => import("./screens/auth/Register"));
const Comments = lazy(() => import("./screens/comments/Comments"));
// import LoginPage from "./screens/auth/Login";
// import RegisterPage from "./screens/auth/Register";
// import Comments from "./screens/comments/Comments";

function App() {
  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <AuthProvider>
            <Layout />
          </AuthProvider>
        }
      >
        <Route
          index
          element={
            <PrivateRoute>
              <Comments />
            </PrivateRoute>
          }
        />
      </Route>
      <Route
        path={"/auth/login"}
        element={
          <RestrictedRoute>
            <LoginPage />
          </RestrictedRoute>
        }
      />
      <Route
        path={"/auth/register"}
        element={
          <RestrictedRoute>
            <RegisterPage />
          </RestrictedRoute>
        }
      />
    </Routes>
  );
}

export default App;
