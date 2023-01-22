import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterForm } from "./components/Register";
import { LoginForm } from "./components/Login";
import { Routes } from "./utils";
import { UserDashboard } from "./components/Dashboard/UserDashboard";
import store from "./state/store";
import { Provider } from "react-redux";
import "./Css/Global.css";
import ResetPasswordForm from "./components/ResetPasswordForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserDashboard />,
  },
  {
    path: Routes.LOGIN_ROUTE,
    element: <LoginForm />,
  },
  {
    path: Routes.REGISTER_ROUTE,
    element: <RegisterForm />,
  },
  {
    path: Routes.FORGOT_PASSWORD_ROUTE,
    element: <ResetPasswordForm />,
  },
  {
    path: Routes.USER_ROUTE,
    element: <UserDashboard />,
  },
]);

const root = document.getElementById("root");
root.style.height = window.innerHeight + "px";

window.addEventListener("resize", () => {
  root.style.height = window.innerHeight + "px";
});

ReactDOM.createRoot(root).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
