import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterForm } from "./components/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/user",
    element: <h1>user page not created yet</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
