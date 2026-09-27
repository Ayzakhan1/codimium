import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Handshake,
  Layers3,
  PhoneCall,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

const STATUS_LIST = [
  "New",
  "Contacted",
  "Interested",
  "Meeting",
  "Proposal Sent",
  "Won",
  "Lost",
];

const STATUS_STYLES = {
  New: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    bar: "bg-sky-500",
  },
  Contacted: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    bar: "bg-cyan-500",
  },
  Interested: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    bar: "bg-blue-500",
  },
  Meeting: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    bar: "bg-violet-500",
  },
  "Proposal Sent": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    bar: "bg-amber-500",
  },
  Won: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
  },
  Lost: {
    bg: "bg-red-50",
    text: "text-red-700",
    bar: "bg-red-500",
  },
};

const getStatusStyle = (status) => {
  return (
    STATUS_STYLES[status] || {
      bg: "bg-slate-50",
      text: "text-slate-700",
      bar: "bg-slate-400",
    }
  );
};

const isSameDay = (dateValue, compareDate = new Date()) => {
  if (!dateValue) return false;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === compareDate.getFullYear() &&
    date.getMonth() === compareDate.getMonth() &&
    date.getDate() === compareDate.getDate()
  );
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRelativeFollowUpLabel = (dateValue) => {
  if (!dateValue) return "No follow-up";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "No follow-up";

  const today = new Date();

  if (isSameDay(date, today)) {
    return "Today";
  }

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, tomorrow)) {
    return "Tomorrow";
  }

  if (date < today) {
    return "Overdue";
  }

  return formatDate(date);
};

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch("/api/leads", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load leads");
        }

        const data = await response.json();

        // Supports:
        // 1. API returning an array directly
        // 2. API returning { leads: [...] }
        setLeads(Array.isArray(data) ? data : data.leads || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardData = useMemo(() => {
    const statusCounts = STATUS_LIST.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    const categoryCounts = {};
    const cityCounts = {};

    leads.forEach((lead) => {
      const status = lead.status || "New";
      const category = lead.category || "Other";
      const city = lead.city || "Unknown";

      if (statusCounts[status] !== undefined) {
        statusCounts[status] += 1;
      }

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const todayFollowUps = leads
      .filter((lead) => isSameDay(lead.followUpDate))
      .sort(
        (a, b) =>
          new Date(a.followUpDate) - new Date(b.followUpDate)
      );

    const upcomingFollowUps = leads
      .filter((lead) => {
        if (!lead.followUpDate) return false;

        const followUpDate = new Date(lead.followUpDate);

        if (Number.isNaN(followUpDate.getTime())) return false;

        return followUpDate > new Date();
      })
      .sort(
        (a, b) =>
          new Date(a.followUpDate) - new Date(b.followUpDate)
      );

    const recentLeads = [...leads]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);

        return dateB - dateA;
      })
      .slice(0, 6);

    const categories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const cities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const maxPipelineCount = Math.max(
      ...STATUS_LIST.map((status) => statusCounts[status]),
      1
    );

    return {
      total: leads.length,
      statusCounts,
      todayFollowUps,
      upcomingFollowUps,
      recentLeads,
      categories,
      cities,
      maxPipelineCount,
    };
  }, [leads]);

  const statCards = [
    {
      title: "Total Leads",
      value: dashboardData.total,
      icon: Layers3,
      iconBg: "bg-[#F0FAFF]",
      iconColor: "text-[#075985]",
    },
    {
      title: "New Leads",
      value: dashboardData.statusCounts.New,
      icon: UserPlus,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      title: "Contacted",
      value: dashboardData.statusCounts.Contacted,
      icon: PhoneCall,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Interested",
      value: dashboardData.statusCounts.Interested,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Meetings",
      value: dashboardData.statusCounts.Meeting,
      icon: CalendarClock,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Won",
      value: dashboardData.statusCounts.Won,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Lost",
      value: dashboardData.statusCounts.Lost,
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#075985]">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Monitor leads, follow-ups and your sales pipeline.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#9DDEF7] hover:bg-[#F0FAFF] hover:text-[#075985]"
          >
            <Users size={17} />
            View Leads
          </Link>

          <Link
            to="/admin/pipeline"
            className="inline-flex items-center gap-2 rounded-xl bg-[#075985] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064e73]"
          >
            <Handshake size={17} />
            View Pipeline
          </Link>
        </div>
      </div>

      {/* =========================================
          ERROR
      ========================================== */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================================
          STAT CARDS
      ========================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {loading ? "—" : card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          MAIN GRID
      ========================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* =======================================
            PIPELINE
        ======================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Sales Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current leads at each stage.
              </p>
            </div>

            <Link
              to="/admin/pipeline"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#075985] hover:text-[#064e73]"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {STATUS_LIST.map((status) => {
              const count = dashboardData.statusCounts[status];
              const style = getStatusStyle(status);

              const percentage =
                dashboardData.maxPipelineCount > 0
                  ? (count / dashboardData.maxPipelineCount) * 100
                  : 0;

              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                      >
                        {status}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =======================================
            TODAY'S FOLLOW UPS
        ======================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Today's Follow-ups
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Leads that need attention today.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FAFF] text-[#075985]">
              <CalendarClock size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">
                Loading follow-ups...
              </p>
            ) : dashboardData.todayFollowUps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <Clock3 className="mx-auto text-slate-400" size={24} />

                <p className="mt-2 text-sm font-medium text-slate-600">
                  No follow-ups for today
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              dashboardData.todayFollowUps.slice(0, 5).map((lead) => (
                <Link
                  key={lead._id || lead.id}
                  to={`/admin/leads/${lead._id || lead.id}`}
                  className="group block rounded-xl border border-slate-100 p-3 transition hover:border-[#9DDEF7] hover:bg-[#F0FAFF]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-[#075985]">
                        {lead.businessName || "Unnamed Business"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {lead.notes || "Follow up with this lead."}
                      </p>
                    </div>

                    <ChevronRight
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-400 group-hover:text-[#075985]"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            to="/admin/follow-ups"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#075985] hover:text-[#064e73]"
          >
            View follow-ups
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>

      {/* =========================================
          SECOND GRID
      ========================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* =======================================
            RECENT LEADS
        ======================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Recent Leads
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest leads added to the CRM.
              </p>
            </div>

            <Link
              to="/admin/leads"
              className="text-sm font-semibold text-[#075985] hover:text-[#064e73]"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Loading leads...
              </p>
            ) : dashboardData.recentLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                <FileText
                  className="mx-auto text-slate-400"
                  size={26}
                />

                <p className="mt-2 text-sm font-medium text-slate-600">
                  No leads found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add your first lead to start tracking the pipeline.
                </p>

                <Link
                  to="/admin/leads"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#075985] px-3 py-2 text-xs font-semibold text-white hover:bg-[#064e73]"
                >
                  <Plus size={15} />
                  Add Lead
                </Link>
              </div>
            ) : (
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Business
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      City
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Follow-up
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.recentLeads.map((lead) => {
                    const style = getStatusStyle(
                      lead.status || "New"
                    );

                    return (
                      <tr
                        key={lead._id || lead.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <Link
                            to={`/admin/leads/${lead._id || lead.id}`}
                            className="font-semibold text-slate-800 hover:text-[#075985]"
                          >
                            {lead.businessName ||
                              "Unnamed Business"}
                          </Link>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {lead.contactPerson || "No contact person"}
                          </p>
                        </td>

                        <td className="py-4 pr-4 text-sm text-slate-600">
                          {lead.city || "—"}
                        </td>

                        <td className="py-4 pr-4 text-sm text-slate-600">
                          {lead.category || "—"}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>

                        <td className="py-4 text-sm text-slate-500">
                          {getRelativeFollowUpLabel(
                            lead.followUpDate
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* =======================================
            CATEGORY + CITY
        ======================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Lead Insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Where your leads are coming from.
            </p>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Top Categories
              </h3>

              <span className="text-xs text-slate-400">
                Leads
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {dashboardData.categories.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No category data available.
                </p>
              ) : (
                dashboardData.categories.map(([category, count]) => {
                  const maxCategory =
                    dashboardData.categories[0]?.[1] || 1;

                  const width =
                    (count / maxCategory) * 100;

                  return (
                    <div key={category}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-slate-600">
                          {category}
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {count}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#27B9F2]"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cities */}
          <div className="mt-7 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Top Cities
              </h3>

              <span className="text-xs text-slate-400">
                Leads
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {dashboardData.cities.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No city data available.
                </p>
              ) : (
                dashboardData.cities.map(([city, count]) => {
                  const maxCity =
                    dashboardData.cities[0]?.[1] || 1;

                  const width = (count / maxCity) * 100;

                  return (
                    <div key={city}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-slate-600">
                          {city}
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {count}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#075985]"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* =========================================
          UPCOMING FOLLOW-UPS
      ========================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Upcoming Follow-ups
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of the next conversations with potential clients.
            </p>
          </div>

          <Link
            to="/admin/follow-ups"
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#075985] hover:text-[#064e73]"
          >
            Open follow-ups
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading upcoming follow-ups...
            </p>
          ) : dashboardData.upcomingFollowUps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center md:col-span-2 xl:col-span-3">
              <Clock3
                className="mx-auto text-slate-400"
                size={24}
              />

              <p className="mt-2 text-sm font-medium text-slate-600">
                No upcoming follow-ups
              </p>
            </div>
          ) : (
            dashboardData.upcomingFollowUps
              .slice(0, 6)
              .map((lead) => (
                <Link
                  key={lead._id || lead.id}
                  to={`/admin/leads/${lead._id || lead.id}`}
                  className="group rounded-xl border border-slate-100 p-4 transition hover:border-[#9DDEF7] hover:bg-[#F0FAFF]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-[#075985]">
                        {lead.businessName ||
                          "Unnamed Business"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {lead.contactPerson ||
                          "No contact person"}
                      </p>
                    </div>

                    <ChevronRight
                      size={16}
                      className="shrink-0 text-slate-400 group-hover:text-[#075985]"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CalendarClock size={14} />
                    {getRelativeFollowUpLabel(
                      lead.followUpDate
                    )}
                  </div>
                </Link>
              ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

