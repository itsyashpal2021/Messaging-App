import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterForm } from "./components/Register";
import { LoginForm } from "./components/Login";
import { Routes } from "./utils";
import { UserDashboard } from "./user/UserDashboard";
import store from "./state/store";
import { Provider } from "react-redux";

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
    path: Routes.USER_ROUTE,
    element: <UserDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
