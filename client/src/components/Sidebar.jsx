import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRoundPlus,
  KanbanSquare,
  CalendarClock,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  // Get logged-in user
  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Unable to read user:", error);
  }

  const isAdmin = currentUser?.role === "admin";

  // Admin menu
 const adminMenuItems = [

    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      path: "/admin/leads",
      icon: UserRoundPlus,
    },
    {
      name: "Pipeline",
      path: "/admin/pipeline",
      icon: KanbanSquare,
    },
    {
      name: "Follow-ups",
      path: "/admin/follow-ups",
      icon: CalendarClock,
    },
    {
      name: "Team Members",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  // Team Member menu
  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Leads",
      path: "/user/leads",
      icon: UserRoundPlus,
    },
    {
      name: "My Pipeline",
      path: "/user/pipeline",
      icon: KanbanSquare,
    },
    {
      name: "My Follow-ups",
      path: "/user/follow-ups",
      icon: CalendarClock,
    },
  ];

  // Select menu according to role
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-surface
        border-r border-border
        text-ink-secondary
        p-5
        flex
        flex-col

        max-md:fixed
        max-md:bottom-0
        max-md:left-0
        max-md:right-0
        max-md:w-full
        max-md:min-h-0
        max-md:h-17
        max-md:p-2
        max-md:border-r-0
        max-md:border-t
        max-md:z-50
      "
    >
      {/* Navigation */}

      <nav
        className="
          space-y-2

          max-md:flex
          max-md:items-center
          max-md:justify-between
          max-md:space-y-0
          max-md:gap-1
          max-md:w-full
          max-md:h-full
        "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.name}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                font-medium
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-ink-secondary hover:bg-background hover:text-primary"
                }

                max-md:flex-1
                max-md:flex-col
                max-md:justify-center
                max-md:items-center
                max-md:gap-1
                max-md:px-1
                max-md:py-1.5
                max-md:rounded-md
              `
              }
            >
              <Icon size={21} strokeWidth={2} className="shrink-0" />

              {/* Name - Desktop only */}

              <span className="max-md:hidden">{item.name}</span>
            </NavLink>
          );
        })}

        {/* Mobile Logout */}

        <button
          type="button"
          title="Logout"
          onClick={handleLogout}
          className="
            hidden
            max-md:flex
            max-md:flex-1
            max-md:flex-col
            max-md:items-center
            max-md:justify-center
            max-md:gap-1
            max-md:rounded-md
            max-md:px-1
            max-md:py-1.5
            max-md:text-ink-secondary
            max-md:hover:bg-background
            max-md:hover:text-primary
          "
        >
          <LogOut size={21} strokeWidth={2} />
          <span className="text-xs">Logout</span>
        </button>
      </nav>

      {/* Desktop Logout */}

      <button
        type="button"
        title="Logout"
        onClick={handleLogout}
        className="
          mt-auto
          flex
          items-center
          gap-3
          rounded-lg
          bg-primary
          px-4
          py-3
          font-medium
          text-white
          transition-all
          duration-200
          hover:bg-primary-hover

          max-md:hidden
        "
      >
        <LogOut size={21} strokeWidth={2} className="shrink-0" />

        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
