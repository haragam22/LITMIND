import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0ProviderWrapper } from "./integrations/Auth0ProviderWrapper";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0ProviderWrapper>
      <App />
    </Auth0ProviderWrapper>
  </React.StrictMode>
);