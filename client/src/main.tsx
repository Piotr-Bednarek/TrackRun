import React from "react";
import ReactDOM from "react-dom/client";

import LoginPage from "./routes/LoginPage";
import UserPage from "./routes/UserPage";
import LandingPage from "./routes/LandingPage";

// import App from "./App";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/user/:userUid",
    element: <UserPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
