
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  User,
  Search,
  RefreshCw,
  Eye,
  X,
  Mail,
  UserRound,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_URL}/api/admin/team_member/get-team-members`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTeamMembers(
        Array.isArray(response.data.users)
          ? response.data.users
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching team members:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Could not fetch team members. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTeamMembers();
    }
    fetchData();
    
  }, []);

  // Search team members
  const filteredMembers = teamMembers.filter((member) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      String(member.name || "").toLowerCase().includes(search) ||
      String(member.email || "").toLowerCase().includes(search) ||
      String(member.role || "").toLowerCase().includes(search)
    );
  });

  // Count team members
  const teamMemberCount = teamMembers.filter((member) =>
    ["team member", "teammember", "team_member", "member"].includes(
      String(member.role || "").toLowerCase().trim()
    )
  ).length;

  const getRole = (member) => member.role || "Team Member";

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedMember(null);
  };


  return (
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-x-clip bg-background sm:space-y-6">

      {/* Page Header */}
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Team Members
          </h1>

          <p className="mt-1 wrap-break-word text-sm text-ink-muted sm:text-base">
            View registered team members
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTeamMembers}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-background sm:w-fit"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex w-full min-w-0 items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="min-w-0 wrap-break-word">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="shrink-0 rounded-md p-1 hover:bg-red-100"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="w-full min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="wrap-break-word text-sm text-ink-muted">
                Total Members
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {teamMembers.length}
              </h2>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary sm:h-11 sm:w-11">
              <Users size={23} />
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="wrap-break-word text-sm text-ink-muted">
                Team Members
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {teamMemberCount}
              </h2>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary sm:h-11 sm:w-11">
              <UserRound size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <section className="w-full min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
        <label
          htmlFor="member-search"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Search Team Members
        </label>

        <div className="relative w-full min-w-0">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />

          <input
            id="member-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or role..."
            className="block w-full min-w-0 max-w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <p className="mt-3 wrap-break-word text-sm text-ink-muted">
          Showing{" "}
          <span className="font-semibold text-ink">
            {filteredMembers.length}
          </span>{" "}
          {filteredMembers.length === 1 ? "member" : "members"}
        </p>
      </section>

      {/* Registered Members */}
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex min-w-0 flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <h2 className="wrap-break-word font-semibold text-ink sm:text-lg">
              Registered Members
            </h2>

            <p className="mt-1 wrap-break-word text-sm text-ink-muted">
              View registered accounts
            </p>
          </div>

          <span className="w-fit max-w-full shrink-0 rounded-full bg-background px-3 py-1 text-xs font-medium text-ink-secondary">
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1 ? "member" : "members"}
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="px-4 py-12 text-center sm:py-16">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background text-ink-muted">
              <Users size={25} />
            </div>

            <h3 className="wrap-break-word font-semibold text-ink">
              {searchTerm
                ? "No matching members found"
                : "No team members found"}
            </h3>

            <p className="mt-1 wrap-break-word text-sm text-ink-muted">
              {searchTerm
                ? "Try a different search term."
                : "Registered members will appear here when available."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 md:hidden">
              {filteredMembers.map((member, index) => (
                <article
                  key={member._id || member.email || index}
                  className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-surface p-3 sm:p-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                      <User size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word text-sm font-semibold text-ink">
                        {member.name || "Unnamed Member"}
                      </h3>

                      <p className="mt-1 break-all text-xs text-ink-muted">
                        ID: {member._id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <Mail
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Email</p>
                        <p className="break-all text-sm text-ink-secondary">
                          {member.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-ink-muted">Role</p>
                        <p className="wrap-break-word text-sm font-medium text-ink">
                          {getRole(member)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-ink-muted">Status</p>
                        <p className="wrap-break-word text-sm text-ink-secondary">
                          {member.status || "Registered"}
                        </p>
                      </div>
                    </div>
                  </div>

                <div className="mt-3 flex min-w-0 items-center justify-end border-t border-border pt-2">
  <button
    type="button"
    onClick={() => {
      setSelectedMember(member);
      setShowDetails(true);
    }}
    title="View member"
    aria-label="View member"
    className="rounded-lg p-2 text-ink-secondary transition hover:bg-background hover:text-primary"
  >
    <Eye size={17} />
  </button>
</div>
                </article>
              ))}
            </div>

            {/* Desktop / Tablet Table */}
            <div className="hidden w-full min-w-0 max-w-full md:block">
              <table className="w-full table-fixed text-left">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="w-[27%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:px-5">
                      Member
                    </th>

                    <th className="w-[29%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:px-5">
                      Email
                    </th>

                    <th className="w-[16%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:px-5">
                      Role
                    </th>

                    <th className="w-[16%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:px-5">
                      Status
                    </th>

                    <th className="w-[12%] px-2 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:px-4">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredMembers.map((member, index) => (
                    <tr
                      key={member._id || member.email || index}
                      className="transition hover:bg-background/60"
                    >
                      <td className="px-3 py-4 lg:px-5">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                            <User size={17} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="wrap-break-word text-sm font-semibold text-ink">
                              {member.name || "Unnamed Member"}
                            </p>

                            <p className="mt-1 break-all text-xs text-ink-muted">
                              ID: {member._id || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 lg:px-5">
                        <div className="flex min-w-0 items-start gap-2 text-sm text-ink-secondary">
                          <Mail
                            size={15}
                            className="mt-0.5 shrink-0"
                          />

                          <span className="min-w-0 break-all">
                            {member.email || "No email"}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4 lg:px-5">
                        <span className="block wrap-break-word text-sm text-ink">
                          {getRole(member)}
                        </span>
                      </td>

                      <td className="px-3 py-4 lg:px-5">
                        <span className="block wrap-break-word text-xs text-ink-secondary">
                          {member.status || "Registered"}
                        </span>
                      </td>

                      <td className="px-2 py-4 lg:px-4">
  <button
    type="button"
    onClick={() => {
      setSelectedMember(member);
      setShowDetails(true);
    }}
    title="View member"
    aria-label="View member"
    className="rounded-lg p-2 text-ink-secondary transition hover:bg-background hover:text-primary"
  >
    <Eye size={17} />
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* View Details Modal */}
      {showDetails && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 p-3 sm:p-5">
          <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-lg overflow-y-auto overflow-x-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
              <h2 className="min-w-0 wrap-break-word text-lg font-bold text-ink">
                Team Member Details
              </h2>

              <button
                type="button"
                onClick={closeDetails}
                aria-label="Close details"
                className="shrink-0 rounded-lg p-2 text-ink-secondary hover:bg-background"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Name</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedMember.name || "Not provided"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Email</p>
                <p className="break-all font-medium text-ink">
                  {selectedMember.email || "Not provided"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Role</p>
                <p className="wrap-break-word font-medium text-ink">
                  {getRole(selectedMember)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Status</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedMember.status || "Registered"}
                </p>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <p className="text-sm text-ink-muted">Member ID</p>
                <p className="break-all font-medium text-ink">
                  {selectedMember._id || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-border p-4 sm:p-5">
              <button
                type="button"
                onClick={closeDetails}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary hover:bg-background sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
