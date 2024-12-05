import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import Navigation from "./components/Navigation";

function getLibrary(provider: any) {
  return new ethers.BrowserProvider(provider);
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route>404 Page Not Found</Route>
      </Switch>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </Web3ReactProvider>
  </StrictMode>
);
