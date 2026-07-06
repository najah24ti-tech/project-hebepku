import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/tailwind.css";

import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Layout>
    <Dashboard />
  </Layout>
);

