import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import "./index.css";
import ErrorPage from "./error-page";
import Auth from "./routes/auth";
import Receipts from "./routes/recepits";
import Testroute from "./routes/testroute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    children: [
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "receipts",
        element: <Receipts />,
      },
      {
        path: "testroute",
        element: <Testroute />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
