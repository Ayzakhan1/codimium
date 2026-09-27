import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown , User ,LogOut} from "lucide-react";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const goToDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "team_member") {
      navigate("/user/dashboard");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRoleName = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "team_member") return "Team Member";
    return "User";
  };

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <button
          onClick={goToDashboard}
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#F0FAFF]"
        >
          {/* Logo Image */}
          <img
            src={logo}
            alt="Codimium logo"
            className="h-18 w-18 object-contain"
          />

          {/* Brand */}
          <div className="text-left leading-none">
            <h1 className="text-[20px] font-bold tracking-tight text-[#075985]">
              Codimium
            </h1>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              CRM
            </p>
          </div>
        </button>

        {/* ================= RIGHT SIDE ================= */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-expanded={showMenu}
            className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-200 sm:gap-3 sm:px-3 ${
              showMenu
                ? "border-[#9DDEF7] bg-[#F0FAFF]"
                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            {/* User Avatar */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #075985 0%, #159DD2 55%, #27B9F2 100%)",
              }}
            >
              {userInitial}
            </div>

            {/* User Information */}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {getRoleName(user?.role)}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                showMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ================= DROPDOWN ================= */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.12)]">
              {/* User Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-[#F0FAFF] to-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #075985 0%, #27B9F2 100%)",
                    }}
                  >
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user?.name || "User"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {getRoleName(user?.role)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#F0FAFF]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-[#DDF5FF] group-hover:text-[#0877AA]">
 <User
  size={16}
  strokeWidth={1.8}
/>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Profile
                    </p>
                    <p className="text-[11px] text-slate-400">
                      View your profile
                    </p>
                  </div>
                </button>

                {/* Divider */}
                <div className="my-1.5 border-t border-slate-100" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-red-100 group-hover:text-red-500">
              <LogOut
  size={16}
  strokeWidth={1.8}
/>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-red-600">
                      Logout
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
