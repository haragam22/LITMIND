// src/pages/Callback.tsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  // When Auth0 finishes, redirect to home (or other page)
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/", { replace: true });
      } else if (error) {
        // if there's an error, you can navigate to an error page or show it
        console.error("Auth0 callback error:", error);
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Signing you in…</h2>
      {isLoading && <p>Please wait — finishing authentication.</p>}
      {error && <p style={{ color: "red" }}>Login error: {String(error)}</p>}
    </div>
  );
}