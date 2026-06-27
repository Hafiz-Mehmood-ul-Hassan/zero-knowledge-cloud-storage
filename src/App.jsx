// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./assets/pages/home.jsx";        // new (below)
import Login from "./assets/pages/login.jsx";      // you already have this
import Signup from "./assets/pages/signup.jsx";    // new (below)
import NotFound from "./assets/pages/notfound.jsx"; // tiny 404 (below)
import ForgotPassword from "./assets/pages/ForgotPassword.jsx"
import Dashboard from "./assets/pages/dashboard.jsx";
import ItemVersions from "./assets/pages/itemVersions.jsx";
import AccessUsers from "./assets/pages/AccessUsers.jsx";
import UserDetails from "./assets/pages/UserDetails.jsx";
import ItemActivity from "./assets/pages/ItemActivity.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/itemversions/:itemId" element={<ItemVersions />} />
      <Route path="/accessusers/:itemId" element={<AccessUsers />} />
      <Route path="/userdetails/" element={<UserDetails />} />
      <Route path="/itemactivity/:itemId" element={<ItemActivity />} />
    </Routes>
  );
}
