import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CalendarClock,
  CalendarDays,
  CircleAlert,
  Clock,
  Search,
  Phone,
  Mail,
  MapPin,
  Users,
  BriefcaseBusiness,
  CalendarPlus,
} from "lucide-react";

// Today's date
const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Convert date into YYYY-MM-DD
const getDate = (value) => {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Display date
const formatDate = (value) => {
  const dateValue = getDate(value);

    if (!dateValue) return "Not scheduled";

       const [year, month, day] = dateValue.split("-");

        return new Date(Number(year), Number(month) - 1, Number(day))
        .toLocaleDateString("en-GB", {
           day: "2-digit",
           month: "short",
            year: "numeric",
         });
};

// Check completed leads
const isClosed = (lead) =>
  lead.status === "Won" || lead.status === "Lost";

// Get follow-up status
const getStatus = (lead, today) => {
  const date = getDate(lead.followUpDate);

  if (!date) return "unscheduled";
  if (date < today) return "overdue";
  if (date === today) return "today";

  return "upcoming";
};

export default function FollowUps() {
  const leads = useSelector((state) => state.leads.leads || []);

  const [search, setSearch] = useState("");
const [activeFilter, setActiveFilter] = useState("All");
const [searchResults, setSearchResults] = useState(null);

  const today = getToday();

  const searchLeads = async (e) => {
  const value = e.target.value;

  setSearch(value);

  // Search empty ho to original Redux leads show hon
  if (!value.trim()) {
    setSearchResults(null);
    return;
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/leads/search-leads/${encodeURIComponent(value.trim())}`
    );

    setSearchResults(response.data.data || []);
  } catch (error) {
    console.log("Search Error:", error.response?.data);
    setSearchResults([]);
  }
};

  // Remove Won/Lost leads and sort by follow-up date
  const sourceLeads = searchResults === null ? leads : searchResults;

const followUpLeads = sourceLeads
    .filter((lead) => !isClosed(lead))
    .map((lead) => ({
      ...lead,
      followUpStatus: getStatus(lead, today),
    }))
    .sort((a, b) => {
      const dateA = getDate(a.followUpDate) || "9999-12-31";
      const dateB = getDate(b.followUpDate) || "9999-12-31";

      return dateA.localeCompare(dateB);
    });

  // Separate follow-ups
  const todayLeads = followUpLeads.filter(
    (lead) => lead.followUpStatus === "today"
  );

  const overdueLeads = followUpLeads.filter(
    (lead) => lead.followUpStatus === "overdue"
  );

  const upcomingLeads = followUpLeads.filter(
    (lead) => lead.followUpStatus === "upcoming"
  );

  const unscheduledLeads = followUpLeads.filter(
    (lead) => lead.followUpStatus === "unscheduled"
  );

  // filter
 const filteredLeads = followUpLeads.filter((lead) => {
  return (
    activeFilter === "All" ||
    (activeFilter === "Today" && lead.followUpStatus === "today") ||
    (activeFilter === "Overdue" && lead.followUpStatus === "overdue") ||
    (activeFilter === "Upcoming" && lead.followUpStatus === "upcoming") ||
    (activeFilter === "Not Scheduled" &&
      lead.followUpStatus === "unscheduled")
  );
});

  // Summary cards
  const summaryCards = [
    {
      title: "Due Today",
      count: todayLeads.length,
      icon: <Clock size={21} />,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Overdue",
      count: overdueLeads.length,
      icon: <CircleAlert size={21} />,
      color: "text-error",
      bg: "bg-error/10",
    },
    {
      title: "Upcoming",
      count: upcomingLeads.length,
      icon: <CalendarDays size={21} />,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Not Scheduled",
      count: unscheduledLeads.length,
      icon: <CalendarPlus size={21} />,
      color: "text-ink-secondary",
      bg: "bg-background",
    },
  ];

  const filters = ["All", "Today", "Overdue", "Upcoming", "Not Scheduled"];

  return (
    <div className="min-h-screen min-w-0 space-y-6 bg-background p-4 md:p-6">
      {/* PAGE HEADING */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <CalendarClock size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-ink">Follow-ups</h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Manage your client follow-ups and tasks.
            </p>
          </div>
        </div>

        <div className="w-fit rounded-xl border border-border bg-primary px-4 py-3">
          <p className="text-xs text-white">Today</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {formatDate(today)}
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-surface p-4 transition hover:shadow-md md:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-ink-secondary">{card.title}</p>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {card.count}
                </p>
              </div>

              <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TODAY'S FOLLOW-UPS */}
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CalendarClock size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-ink">Today's Follow-ups</h2>
              <p className="mt-1 text-xs text-ink-secondary">
                Clients you need to contact today.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {todayLeads.length} Due
          </span>
        </div>

        {todayLeads.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-secondary">
            No follow-ups due today.
          </p>
        ) : (
          todayLeads.map((lead) => (
            <article
              key={lead._id}
              className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <BriefcaseBusiness size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink">
                    {lead.businessName || "Unnamed Business"}
                  </h3>

                  <p className="mt-1 text-sm text-ink-secondary">
                    {lead.notes || `Follow up regarding ${lead.potentialService || "requirements"}`}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-secondary">
                    {lead.contactPerson && (
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {lead.contactPerson}
                      </span>
                    )}

                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Phone size={14} />
                        {lead.phone}
                      </a>
                    )}

                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Mail size={14} />
                        {lead.email}
                      </a>
                    )}

                    {lead.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {lead.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3 md:justify-end md:border-t-0 md:pt-0">
                <div>
                  <p className="text-xs text-ink-muted">Follow-up Date</p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {formatDate(lead.followUpDate)}
                  </p>
                  <p className="mt-1 text-xs text-ink-secondary">
                    Status: {lead.status}
                  </p>
                </div>

                {lead.phone && (
                  <a href={`tel:${lead.phone}`} aria-label="Call lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Phone size={17} />
                  </a>
                )}

                {lead.email && (
                  <a href={`mailto:${lead.email}`} aria-label="Email lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Mail size={17} />
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      {/* OVERDUE FOLLOW-UPS */}
      {overdueLeads.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-error/30 bg-surface">
          <div className="flex items-center gap-3 border-b border-error/20 p-4 md:p-5">
            <div className="rounded-lg bg-error/10 p-2 text-error">
              <CircleAlert size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-ink">Overdue Follow-ups</h2>
              <p className="mt-1 text-xs text-ink-secondary">
                These clients need your attention.
              </p>
            </div>

            <span className="ml-auto rounded-full bg-error/10 px-3 py-1 text-xs font-semibold text-error">
              {overdueLeads.length} Overdue
            </span>
          </div>

          {overdueLeads.map((lead) => (
            <article
              key={lead._id}
              className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-error/10 p-3 text-error">
                  <BriefcaseBusiness size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">
                      {lead.businessName || "Unnamed Business"}
                    </h3>
                    <span className="rounded-full bg-error/10 px-2.5 py-1 text-[11px] font-semibold text-error">
                      Overdue
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-ink-secondary">
                    {lead.notes || `Follow up regarding ${lead.potentialService || "requirements"}`}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-secondary">
                    {lead.contactPerson && (
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {lead.contactPerson}
                      </span>
                    )}

                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Phone size={14} />
                        {lead.phone}
                      </a>
                    )}

                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Mail size={14} />
                        {lead.email}
                      </a>
                    )}

                    {lead.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {lead.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3 md:justify-end md:border-t-0 md:pt-0">
                <div>
                  <p className="text-xs text-ink-muted">Follow-up Date</p>
                  <p className="mt-1 text-sm font-semibold text-error">
                    {formatDate(lead.followUpDate)}
                  </p>
                  <p className="mt-1 text-xs text-ink-secondary">
                    Status: {lead.status}
                  </p>
                </div>

                {lead.phone && (
                  <a href={`tel:${lead.phone}`} aria-label="Call lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Phone size={17} />
                  </a>
                )}

                {lead.email && (
                  <a href={`mailto:${lead.email}`} aria-label="Email lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Mail size={17} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ALL FOLLOW-UPS */}
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="space-y-4 border-b border-border p-4 md:p-5">
          <div>
            <h2 className="font-semibold text-ink">All Follow-ups</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Search and filter your leads.
            </p>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <input
              type="text"
              value={search}
              onChange={searchLeads}
              placeholder="Search business, phone, contact..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? "border-primary bg-primary text-white hover:bg-primary-hover"
                    : "border-border bg-surface text-ink-secondary hover:border-primary hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-secondary">
            No matching follow-ups found.
          </p>
        ) : (
          filteredLeads.map((lead) => (
            <article
              key={lead._id}
              className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className={`rounded-xl p-3 ${
                  lead.followUpStatus === "overdue"
                    ? "bg-error/10 text-error"
                    : lead.followUpStatus === "today"
                      ? "bg-primary/10 text-primary"
                      : lead.followUpStatus === "upcoming"
                        ? "bg-success/10 text-success"
                        : "bg-background text-ink-secondary"
                }`}>
                  <BriefcaseBusiness size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">
                      {lead.businessName || "Unnamed Business"}
                    </h3>

                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      lead.followUpStatus === "overdue"
                        ? "bg-error/10 text-error"
                        : lead.followUpStatus === "today"
                          ? "bg-primary/10 text-primary"
                          : lead.followUpStatus === "upcoming"
                            ? "bg-success/10 text-success"
                            : "bg-background text-ink-secondary"
                    }`}>
                      {lead.followUpStatus === "today"
                        ? "Due Today"
                        : lead.followUpStatus === "overdue"
                          ? "Overdue"
                          : lead.followUpStatus === "upcoming"
                            ? "Upcoming"
                            : "Not Scheduled"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-ink-secondary">
                    {lead.notes || `Follow up regarding ${lead.potentialService || "requirements"}`}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-secondary">
                    {lead.contactPerson && (
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {lead.contactPerson}
                      </span>
                    )}

                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Phone size={14} />
                        {lead.phone}
                      </a>
                    )}

                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Mail size={14} />
                        {lead.email}
                      </a>
                    )}

                    {lead.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {lead.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3 md:justify-end md:border-t-0 md:pt-0">
                <div>
                  <p className="text-xs text-ink-muted">Follow-up Date</p>
                  <p className={`mt-1 text-sm font-semibold ${
                    lead.followUpStatus === "overdue"
                      ? "text-error"
                      : lead.followUpStatus === "today"
                        ? "text-primary"
                        : lead.followUpStatus === "upcoming"
                          ? "text-success"
                          : "text-ink-secondary"
                  }`}>
                    {formatDate(lead.followUpDate)}
                  </p>
                  <p className="mt-1 text-xs text-ink-secondary">
                    Status: {lead.status}
                  </p>
                </div>

                {lead.phone && (
                  <a href={`tel:${lead.phone}`} aria-label="Call lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Phone size={17} />
                  </a>
                )}

                {lead.email && (
                  <a href={`mailto:${lead.email}`} aria-label="Email lead" className="rounded-lg bg-primary p-2.5 text-white hover:bg-primary-hover">
                    <Mail size={17} />
                  </a>
                )}
              </div>
            </article>
          ))
        )}

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-ink-secondary">
            Showing {filteredLeads.length} of {followUpLeads.length} active leads
          </p>
        </div>
      </section>
    </div>
  );
}
