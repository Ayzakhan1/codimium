
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { leadData } from "../redux/slices/leadSlice";

const Layout = () => {
  const dispatch = useDispatch();

  // Logged-in user from Redux
  const authUser = useSelector(
    (state) =>
      state.auth?.user ||
      state.auth?.userInfo ||
      null
  );

  // Fallback: user from localStorage
  const storedUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  })();

  const currentUser = authUser || storedUser;
  const role = currentUser?.role;

  useEffect(() => {
    if (!role) {
      console.warn("User role not found. Leads were not fetched.");
      return;
    }

    const getLeads = async () => {
      try {
       const endpoint =
  role === "team_member"
    ? "/api/team-member/member-leads/my-leads"
    : role === "admin"
    ? "/api/admin/leads/get-leads"
    : null;

        if (!endpoint) {
          dispatch(leadData([]));
          console.warn("Unsupported user role:", role);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        dispatch(leadData(response.data.data || []));
      } catch (error) {
        console.error(
          "Error getting leads:",
          error.response?.data || error.message
        );
      }
    };

    getLeads();
  }, [dispatch, role]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
