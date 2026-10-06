import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <button
          onClick={goToDashboard}
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:border-primary-hover hover:bg-background"
        >
          {/* Logo Image */}
          <img
            src={logo}
            alt="Codimium logo"
            className="h-15 w-15 object-contain"
          />

          {/* Brand */}
          <div className="text-left leading-none">
            <h1 className="text-[20px] font-bold tracking-tight text-primary-hover">
              Codimium
            </h1>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink-muted">
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
            className={`flex items-center gap-2 rounded-xl border border-border px-2 py-1.5 transition-all duration-200 sm:gap-3 sm:px-3 ${
              showMenu
                ? "border-border bg-background"
                : "transition hover:border-primary-hover hover:bg-background"
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
              <p className="max-w-[150px] truncate text-sm font-semibold text-ink">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 text-xs font-medium text-ink-muted">
                {getRoleName(user?.role)}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={16}
              className={`text-ink-muted transition-transform duration-200 ${
                showMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ================= DROPDOWN ================= */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-[260px] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_15px_45px_rgba(15,23,42,0.12)]">
              {/* User Header */}
              <div className="border-b border-border bg-gradient-to-r from-background to-surface px-4 py-4">
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
                    <p className="truncate text-sm font-semibold text-ink">
                      {user?.name || "User"}
                    </p>

                    <p className="mt-0.5 text-xs text-ink-muted">
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
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-background"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-border text-ink-muted transition group-hover:bg-background group-hover:text-primary">
                    <User
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink-secondary">
                      Profile
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      View your profile
                    </p>
                  </div>
                </button>

                {/* Divider */}
                <div className="my-1.5 border-t border-border" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-border text-ink-muted transition group-hover:bg-red-100 group-hover:text-error">
                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink-secondary group-hover:text-error">
                      Logout
                    </p>
                    <p className="text-[11px] text-ink-muted">
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