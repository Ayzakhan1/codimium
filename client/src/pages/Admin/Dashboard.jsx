import { useEffect, useState } from "react";
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

// Status ka color
const getStatusStyle = (status) => {
  if (status === "Won") {
    return {
      bg: "bg-background",
      text: "text-success",
      bar: "bg-success",
    };
  }

  if (status === "Lost") {
    return {
      bg: "bg-background",
      text: "text-error",
      bar: "bg-error",
    };
  }

  if (status === "Meeting" || status === "Proposal Sent") {
    return {
      bg: "bg-background",
      text: "text-primary-hover",
      bar: "bg-primary-hover",
    };
  }

  return {
    bg: "bg-background",
    text: "text-primary",
    bar: "bg-primary",
  };
};

// Date ko readable format mein show karne ke liye
const formatDate = (date) => {
  if (!date) return "No date";

  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) {
    return "No date";
  }

  return newDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Check karta hai ke date aaj ki hai ya nahi
const isToday = (date) => {
  if (!date) return false;

  const today = new Date();
  const followUp = new Date(date);

  return (
    today.getFullYear() === followUp.getFullYear() &&
    today.getMonth() === followUp.getMonth() &&
    today.getDate() === followUp.getDate()
  );
};

// Follow-up ka simple label
const getFollowUpText = (date) => {
  if (!date) return "No follow-up";

  const followUp = new Date(date);

  if (isToday(date)) {
    return "Today";
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (
    followUp.getFullYear() === tomorrow.getFullYear() &&
    followUp.getMonth() === tomorrow.getMonth() &&
    followUp.getDate() === tomorrow.getDate()
  ) {
    return "Tomorrow";
  }

  if (followUp < new Date()) {
    return "Overdue";
  }

  return formatDate(date);
};

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dashboard ke liye leads load karna
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch("/api/leads", {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load leads");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          setLeads(data.leads || []);
        }
      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();


  }, []);




  // -----------------------------
  // Simple Lead Counts
  // -----------------------------

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => (lead.status || "New") === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const meetingLeads = leads.filter(
    (lead) => lead.status === "Meeting"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "Won"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  // -----------------------------
  // Today's Follow-ups
  // -----------------------------

  const todayFollowUps = leads.filter((lead) =>
    isToday(lead.followUpDate)
  );

  // -----------------------------
  // Upcoming Follow-ups
  // -----------------------------

  const upcomingFollowUps = leads
    .filter((lead) => {
      if (!lead.followUpDate) return false;

      return new Date(lead.followUpDate) > new Date();
    })
    .sort(
      (a, b) =>
        new Date(a.followUpDate) -
        new Date(b.followUpDate)
    );

  // -----------------------------
  // Recent Leads
  // -----------------------------

  const recentLeads = [...leads]
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    })
    .slice(0, 6);

  // -----------------------------
  // Categories
  // -----------------------------

  const categoryData = {};

  leads.forEach((lead) => {
    const category = lead.category || "Other";

    if (categoryData[category]) {
      categoryData[category]++;
    } else {
      categoryData[category] = 1;
    }
  });

  const categories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // -----------------------------
  // Cities
  // -----------------------------

  const cityData = {};

  leads.forEach((lead) => {
    const city = lead.city || "Unknown";

    if (cityData[city]) {
      cityData[city]++;
    } else {
      cityData[city] = 1;
    }
  });

  const cities = Object.entries(cityData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Pipeline counts
  const statusCounts = {
    New: newLeads,
    Contacted: contactedLeads,
    Interested: interestedLeads,
    Meeting: meetingLeads,
    "Proposal Sent": leads.filter(
      (lead) => lead.status === "Proposal Sent"
    ).length,
    Won: wonLeads,
    Lost: lostLeads,
  };

  const biggestStatusCount = Math.max(
    ...Object.values(statusCounts),
    1
  );

  // Stat cards
  const statCards = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Layers3,
      iconColor: "text-primary",
    },
    {
      title: "New Leads",
      value: newLeads,
      icon: UserPlus,
      iconColor: "text-primary",
    },
    {
      title: "Contacted",
      value: contactedLeads,
      icon: PhoneCall,
      iconColor: "text-primary",
    },
    {
      title: "Interested",
      value: interestedLeads,
      icon: TrendingUp,
      iconColor: "text-primary",
    },
    {
      title: "Meetings",
      value: meetingLeads,
      icon: CalendarClock,
      iconColor: "text-primary-hover",
    },
    {
      title: "Won",
      value: wonLeads,
      icon: CheckCircle2,
      iconColor: "text-success",
    },
    {
      title: "Lost",
      value: lostLeads,
      icon: XCircle,
      iconColor: "text-error",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary-hover">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-ink-muted sm:text-base">
            Monitor leads, follow-ups and your sales pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary transition hover:border-primary-hover hover:bg-background hover:text-primary"
          >
            <Users size={17} />
            View Leads
          </Link>

          <Link
            to="/admin/pipeline"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-hover px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
          >
            <Handshake size={17} />
            View Pipeline
          </Link>
        </div>
      </div>

      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <div className="rounded-xl border border-error bg-background px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* ================================
          STAT CARDS
      ================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-muted">
                    {card.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-ink">
                    {loading ? "—" : card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-background ${card.iconColor}`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================
          PIPELINE + TODAY FOLLOW UPS
      ================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Pipeline */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Sales Pipeline
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Current leads at each stage.
              </p>
            </div>

            <Link
              to="/admin/pipeline"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-hover hover:text-primary"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {STATUS_LIST.map((status) => {
              const count = statusCounts[status];
              const style = getStatusStyle(status);

              const width =
                (count / biggestStatusCount) * 100;

              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {status}
                    </span>

                    <span className="text-sm font-semibold text-ink-secondary">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Today's Follow-ups */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Today's Follow-ups
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Leads that need attention today.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary-hover">
              <CalendarClock size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-ink-muted">
                Loading follow-ups...
              </p>
            ) : todayFollowUps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
                <Clock3
                  className="mx-auto text-ink-muted"
                  size={24}
                />

                <p className="mt-2 text-sm font-medium text-ink-secondary">
                  No follow-ups for today
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  You're all caught up.
                </p>
              </div>
            ) : (
              todayFollowUps.slice(0, 5).map((lead) => (
                <Link
                  key={lead._id || lead.id}
                  to={`/admin/leads/${lead._id || lead.id}`}
                  className="group block rounded-xl border border-border p-3 transition hover:border-primary-hover hover:bg-background"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink group-hover:text-primary-hover">
                        {lead.businessName || "Unnamed Business"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                        {lead.notes || "Follow up with this lead."}
                      </p>
                    </div>

                    <ChevronRight
                      size={16}
                      className="mt-0.5 shrink-0 text-ink-muted group-hover:text-primary-hover"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            to="/admin/follow-ups"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-hover hover:text-primary"
          >
            View follow-ups
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>

      {/* ================================
          RECENT LEADS + INSIGHTS
      ================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Leads */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Recent Leads
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Latest leads added to the CRM.
              </p>
            </div>

            <Link
              to="/admin/leads"
              className="text-sm font-semibold text-primary-hover hover:text-primary"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                Loading leads...
              </p>
            ) : recentLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
                <FileText
                  className="mx-auto text-ink-muted"
                  size={26}
                />

                <p className="mt-2 text-sm font-medium text-ink-secondary">
                  No leads found
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Add your first lead to start tracking the pipeline.
                </p>

                <Link
                  to="/admin/leads"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-hover px-3 py-2 text-xs font-semibold text-white hover:bg-primary"
                >
                  <Plus size={15} />
                  Add Lead
                </Link>
              </div>
            ) : (
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Business
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      City
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Category
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Status
                    </th>

                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Follow-up
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentLeads.map((lead) => {
                    const style = getStatusStyle(
                      lead.status || "New"
                    );

                    return (
                      <tr
                        key={lead._id || lead.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <Link
                            to={`/admin/leads/${lead._id || lead.id}`}
                            className="font-semibold text-ink hover:text-primary-hover"
                          >
                            {lead.businessName ||
                              "Unnamed Business"}
                          </Link>

                          <p className="mt-0.5 text-xs text-ink-muted">
                            {lead.contactPerson ||
                              "No contact person"}
                          </p>
                        </td>

                        <td className="py-4 pr-4 text-sm text-ink-secondary">
                          {lead.city || "—"}
                        </td>

                        <td className="py-4 pr-4 text-sm text-ink-secondary">
                          {lead.category || "—"}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>

                        <td className="py-4 text-sm text-ink-muted">
                          {getFollowUpText(
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

        {/* Lead Insights */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-ink">
              Lead Insights
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Where your leads are coming from.
            </p>
          </div>

          {/* Categories */}

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-secondary">
                Top Categories
              </h3>

              <span className="text-xs text-ink-muted">
                Leads
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {categories.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No category data available.
                </p>
              ) : (
                categories.map(([category, count]) => {
                  const max = categories[0][1];

                  return (
                    <div key={category}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-ink-secondary">
                          {category}
                        </span>

                        <span className="text-xs font-semibold text-ink-secondary">
                          {count}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary-hover"
                          style={{
                            width: `${(count / max) * 100}%`,
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

          <div className="mt-7 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-secondary">
                Top Cities
              </h3>

              <span className="text-xs text-ink-muted">
                Leads
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {cities.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No city data available.
                </p>
              ) : (
                cities.map(([city, count]) => {
                  const max = cities[0][1];

                  return (
                    <div key={city}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-ink-secondary">
                          {city}
                        </span>

                        <span className="text-xs font-semibold text-ink-secondary">
                          {count}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(count / max) * 100}%`,
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

      {/* ================================
          UPCOMING FOLLOW UPS
      ================================= */}

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">
              Upcoming Follow-ups
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Keep track of the next conversations with potential clients.
            </p>
          </div>

          <Link
            to="/admin/follow-ups"
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary-hover hover:text-primary"
          >
            Open follow-ups
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-ink-muted">
              Loading upcoming follow-ups...
            </p>
          ) : upcomingFollowUps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-7 text-center md:col-span-2 xl:col-span-3">
              <Clock3
                className="mx-auto text-ink-muted"
                size={24}
              />

              <p className="mt-2 text-sm font-medium text-ink-secondary">
                No upcoming follow-ups
              </p>
            </div>
          ) : (
            upcomingFollowUps.slice(0, 6).map((lead) => (
              <Link
                key={lead._id || lead.id}
                to={`/admin/leads/${lead._id || lead.id}`}
                className="group rounded-xl border border-border p-4 transition hover:border-primary-hover hover:bg-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink group-hover:text-primary-hover">
                      {lead.businessName ||
                        "Unnamed Business"}
                    </p>

                    <p className="mt-1 text-xs text-ink-muted">
                      {lead.contactPerson ||
                        "No contact person"}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="shrink-0 text-ink-muted group-hover:text-primary-hover"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
                  <CalendarClock size={14} />

                  {getFollowUpText(
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
