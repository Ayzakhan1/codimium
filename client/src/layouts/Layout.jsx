import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { leadData } from "../redux/slices/leadSlice";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getLeads = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/leads/get-leads`
        );

        dispatch(leadData(response.data.data || []));
      } catch (error) {
        console.error("Error getting leads:", error);
      }
    };

    getLeads();
  }, [dispatch]);

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
