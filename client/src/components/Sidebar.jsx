import { NavLink } from "react-router-dom";
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
  const menuItems = [
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

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-white
        border-r border-slate-200
        text-slate-700
        p-5
        flex
        flex-col

        max-md:fixed
        max-md:bottom-0
        max-md:left-0
        max-md:right-0
        max-md:w-full
        max-md:min-h-0
        max-md:h-[68px]
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
                    ? "bg-[#075985] text-white"
                    : "text-slate-700 hover:bg-[#F0FAFF] hover:text-[#075985]"
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
              <Icon
                size={21}
                strokeWidth={2}
                className="shrink-0"
              />

              {/* Name - Desktop only */}
              <span className="max-md:hidden">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        title="Logout"
        className="
          flex
          items-center
          mt-auto
          gap-3
          rounded-lg
          px-4
          py-3
          font-medium
          bg-[#075985]
          text-white
          hover:bg-[#064e73]
          transition-all
          duration-200

          max-md:flex-1
          max-md:flex-col
          max-md:justify-center
          max-md:items-center
          max-md:gap-1
          max-md:px-1
          max-md:py-1.5
          max-md:rounded-md
          max-md:mt-0
          max-md:bg-transparent
          max-md:text-slate-700
          max-md:hover:bg-[#F0FAFF]
          max-md:hover:text-[#075985]
        "
      >
        <LogOut
          size={21}
          strokeWidth={2}
          className="shrink-0"
        />

        {/* Name - Desktop only */}
        <span className="max-md:hidden">
          Logout
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;

