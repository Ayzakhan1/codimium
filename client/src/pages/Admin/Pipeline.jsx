import { useSelector } from "react-redux";
import {
  Users,
  CalendarClock,
  MapPin,
  Phone,
  CircleAlert,
  CheckCircle2,
  Mail,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

const statuses = [
  "New",
  "Contacted",
  "Interested",
  "Meeting",
  "Proposal Sent",
  "Won",
  "Lost",
];

// Dashboard theme colors
const getStatusStyle = (status) => {
  if (status === "Won") {
    return {
      bg: "bg-background",
      text: "text-success",
      bar: "bg-success",
      border: "border-t-success",
      badge: "bg-success/10 text-success",
    };
  }

  if (status === "Lost") {
    return {
      bg: "bg-background",
      text: "text-error",
      bar: "bg-error",
      border: "border-t-error",
      badge: "bg-error/10 text-error",
    };
  }

  if (status === "Meeting" || status === "Proposal Sent") {
    return {
      bg: "bg-background",
      text: "text-primary-hover",
      bar: "bg-primary-hover",
      border: "border-t-primary-hover",
      badge: "bg-primary-hover/10 text-primary-hover",
    };
  }

  return {
    bg: "bg-background",
    text: "text-primary",
    bar: "bg-primary",
    border: "border-t-primary",
    badge: "bg-primary/10 text-primary",
  };
};

export default function Pipeline() {
  const leads = useSelector(
    (state) => state.leads.leads || [],
  );

  const getLeadsByStatus = (status) =>
    leads.filter(
      (lead) => (lead.status || "New") === status,
    );

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not scheduled";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalLeads = leads.length;

  const activeLeads = leads.filter(
    (lead) => !["Won", "Lost"].includes(lead.status || "New"),
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "Won",
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost",
  ).length;

  return (
    <div className="min-h-screen min-w-0 space-y-6 bg-background p-4 md:p-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <BriefcaseBusiness size={22} />
            </div>

            <h1 className="text-2xl font-bold text-ink">
              Sales Pipeline
            </h1>
          </div>

          <p className="mt-2 text-sm text-ink-secondary">
            Track your leads and monitor every stage of your sales journey.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <Users size={18} className="text-primary" />

          <span className="text-sm font-medium text-ink">
            {totalLeads} Total Leads
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Leads"
          value={totalLeads}
          icon={<Users size={20} />}
          color="text-primary"
          iconBg="bg-primary/10"
        />

        <SummaryCard
          title="Active Leads"
          value={activeLeads}
          icon={<ArrowUpRight size={20} />}
          color="text-primary-hover"
          iconBg="bg-primary-hover/10"
        />

        <SummaryCard
          title="Won Deals"
          value={wonLeads}
          icon={<CheckCircle2 size={20} />}
          color="text-success"
          iconBg="bg-success/10"
        />

        <SummaryCard
          title="Lost Deals"
          value={lostLeads}
          icon={<CircleAlert size={20} />}
          color="text-error"
          iconBg="bg-error/10"
        />
      </div>

      {/* PIPELINE BOARD */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Lead Stages
            </h2>

            <p className="mt-1 text-sm text-ink-secondary">
              Leads organized by their current status.
            </p>
          </div>

          <span className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-secondary">
            {statuses.length} Stages
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {statuses.map((currentStatus) => {
            const columnLeads = getLeadsByStatus(currentStatus);
            const style = getStatusStyle(currentStatus);

            return (
              <section
                key={currentStatus}
                className={`flex h-125 min-w-0 flex-col overflow-hidden rounded-xl border border-border border-t-4 bg-surface shadow-sm transition-shadow hover:shadow-md ${style.border}`}
              >
                {/* COLUMN HEADER */}
                <div className="shrink-0 border-b border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.bar}`}
                      />

                      <h3 className="truncate text-sm font-semibold text-ink">
                        {currentStatus}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${style.badge}`}
                    >
                      {columnLeads.length}
                    </span>
                  </div>

                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{
                        width: `${
                          columnLeads.length
                            ? Math.min(
                                100,
                                (columnLeads.length /
                                  Math.max(totalLeads, 1)) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* LEAD CARDS */}
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background/50 p-3">
                  {columnLeads.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 text-center">
                      <div
                        className={`mb-3 rounded-full p-3 ${style.badge}`}
                      >
                        <BriefcaseBusiness size={21} />
                      </div>

                      <p className="text-sm font-medium text-ink">
                        No leads yet
                      </p>

                      <p className="mt-1 text-xs text-ink-muted">
                        Leads will appear here when their status matches.
                      </p>
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <article
                        key={lead._id}
                        className="group min-w-0 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                      >
                        {/* BUSINESS DETAILS */}
                        <div className="mb-3 flex min-w-0 items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.badge}`}
                          >
                            <BriefcaseBusiness size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="wrap-break-words text-sm font-semibold text-ink">
                              {lead.businessName || "Unnamed Business"}
                            </h4>

                            <p className="mt-1 wrap-break-words text-xs text-ink-secondary">
                              {lead.category || "No category"}
                            </p>
                          </div>
                        </div>

                        {/* CONTACT PERSON */}
                        <div className="space-y-2.5 border-t border-border pt-3">
                          <DetailRow
                            icon={<Users size={15} />}
                            value={
                              lead.contactPerson || "No contact person"
                            }
                          />

                          {lead.email && (
                            <DetailRow
                              icon={<Mail size={15} />}
                              value={lead.email}
                            />
                          )}

                          {lead.phone && (
                            <DetailRow
                              icon={<Phone size={15} />}
                              value={lead.phone}
                            />
                          )}

                          {lead.city && (
                            <DetailRow
                              icon={<MapPin size={15} />}
                              value={lead.city}
                            />
                          )}
                        </div>

                        {/* POTENTIAL SERVICE */}
                        <div className="mt-3">
                          <span className="inline-block max-w-full wrap-break-words rounded-md bg-background px-2.5 py-1.5 text-xs font-medium text-ink-secondary">
                            {lead.potentialService || "No service selected"}
                          </span>
                        </div>

                        {/* FOLLOW-UP */}
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-background p-2.5">
                          <CalendarClock
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                          />

                          <div className="min-w-0">
                            <p className="text-[11px] text-ink-muted">
                              Follow-up Date
                            </p>

                            <p className="mt-0.5 wrap-break-words text-xs font-medium text-ink">
                              {formatDate(lead.followUpDate)}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// SUMMARY CARD
function SummaryCard({
  title,
  value,
  icon,
  color,
  iconBg,
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-md md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-ink-secondary">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {value}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${iconBg} ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// REUSABLE CONTACT DETAIL
function DetailRow({ icon, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-sm text-ink-secondary">
      <span className="mt-0.5 shrink-0">
        {icon}
      </span>

      <span className="min-w-0 break-all">
        {value}
      </span>
    </div>
  );
}
