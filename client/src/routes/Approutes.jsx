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
import Pipeline from "../pages/Admin/Pipeline";
import FollowUps from "../pages/Admin/FollowUps";
import TeamMember from "../pages/Admin/TeamMember";
import TeamMemberLeads from "../pages/User/TeamMemberLeads";
import TeamMemberPipeline from "../pages/User/TeamMemberPipeline";
import TeamMemberFollowUps from "../pages/User/TeamMemberFollowUps";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leads" element={<Leads/>} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="follow-ups" element={<FollowUps />} />
        <Route path="users" element={<TeamMember />} />
      </Route>

      {/* User */}
      <Route path="/user" element={<Layout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="leads" element={<TeamMemberLeads />} />
        <Route path="pipeline" element={<TeamMemberPipeline />} />
        <Route path="follow-ups" element={<TeamMemberFollowUps />} />
      </Route>
    </>
  )
);

export default router;