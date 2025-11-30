import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Legal pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Protected pages will later use real auth */}
        <Route path="/app" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
