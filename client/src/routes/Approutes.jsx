import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Layout from "../layouts/Layout";
import AdminDashboard from "../pages/Admin/Dashboard";
import UserDashboard from "../pages/User/Dashboard";
import Leads from "../pages/Admin/Leads";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leads" element={<Leads/>} />
      </Route>

      {/* User */}
      <Route path="/user" element={<Layout />}>
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>
    </>
  )
);

export default router;