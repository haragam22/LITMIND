// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useAuth0 } from "@auth0/auth0-react";
import Callback from "./pages/Callback";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  async function callProtectedFunction() {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:54321/functions/v1/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // <-- fixed template string
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ any: "payload" })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      alert("Server replied: " + JSON.stringify(data));
    } catch (err: any) {
      console.error("Protected call failed:", err);
      alert("Failed: " + (err?.message || String(err)));
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div style={{ padding: 20 }}>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Login</button>
          ) : (
            <>
              <div>
                <strong>{user?.name}</strong> ({user?.email})
              </div>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
                <button onClick={callProtectedFunction} style={{ marginLeft: 8 }}>
                  Call Protected Server
                </button>
              </div>
            </>
          )}

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/callback" element={<Callback />} />    {/* <-- add this */}
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

export default App;