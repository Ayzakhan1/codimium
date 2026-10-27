
import {   useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../../redux/slices/leadSlice";

import {
  CalendarClock,
  CheckCircle2,
  Edit3,
  Eye,
  MapPin,
  Phone,
  User,
  Users,
  X,
  Mail,
  Briefcase,
  Search,
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

const services = [
  "Website",
  "Shopify",
  "SEO",
  "Automation",
  "Web Application",
  "E-commerce",
  "Digital Marketing",
  "Other",
];

const categories = [
  "Restaurant",
  "Real Estate",
  "Healthcare",
  "Education",
  "E-commerce",
  "Retail",
  "Construction",
  "Travel",
  "Finance",
  "Technology",
  "Agency",
  "Other",
];

 const inputClass =
  "w-full min-w-0 max-w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-lg p-2 transition hover:bg-background";

const emptyForm = {
  businessName: "",
  contactPerson: "",
  phone: "",
  email: "",
  city: "",
  category: "",
  websiteUrl: "",
  socialMediaUrl: "",
  potentialService: "",
  status: "New",
  notes: "",
  assignedTo: "",
  followUpDate: "",
};

const statusClass = (value) => {
  const classes = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-purple-100 text-purple-700",
    Interested: "bg-amber-100 text-amber-700",
    Meeting: "bg-indigo-100 text-indigo-700",
    "Proposal Sent": "bg-orange-100 text-orange-700",
    Won: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-700",
  };

  return classes[value] || "bg-background text-ink-secondary";
};

export default function TeamMemberLeads() {
  const dispatch = useDispatch();

  // Adjust this selector if your Redux store uses a different key.
  const reduxLeads = useSelector(
    (state) => state.leads.leads || []
  );


  // Adjust the user selector to match your authentication slice.
  const authUser = useSelector(
    (state) => state.auth?.user || state.auth?.userInfo || null
  );

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
})();

  const currentUser = authUser || storedUser;

  const currentUserId =
    currentUser?._id || currentUser?.id || currentUser?.user?._id;

      console.log("Redux Leads:", reduxLeads);
console.log("Current User ID:", currentUserId);


  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [service, setService] = useState("All");

  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  
  const [saving, setSaving] = useState(false);
  const [savingLeadId, setSavingLeadId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

const assignedLeads = reduxLeads.filter((lead) => {
  const assignedId =
    typeof lead.assignedTo === "object"
      ? lead.assignedTo?._id
      : lead.assignedTo;

  return String(assignedId) === String(currentUserId);
});
console.log("Assigned Leads:", assignedLeads);

  const leads = searchResults ?? assignedLeads;

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
  };

  

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setError("");

    if (!value.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await axios.get(
       `${apiUrl}/api/team-member/member-leads/search/${encodeURIComponent(value.trim())}`,
        { headers }
      );

      const result = response.data.data || [];

      setSearchResults(
        result.filter((lead) => {
          const assignedId =
            typeof lead.assignedTo === "object"
              ? lead.assignedTo?._id || lead.assignedTo?.id
              : lead.assignedTo;

          return (
            currentUserId &&
            String(assignedId || "") === String(currentUserId)
          );
        })
      );
    } catch (err) {
      console.error(
        "Lead search failed:",
        err.response?.data || err.message
      );

      setSearchResults([]);
      setError("Could not search leads. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditForm = (lead) => {
    setSelectedLead(lead);

    setForm({
      businessName: lead.businessName || "",
      contactPerson: lead.contactPerson || "",
      phone: lead.phone || "",
      email: lead.email || "",
      city: lead.city || "",
      category: lead.category || "",
      websiteUrl: lead.websiteUrl || "",
      socialMediaUrl: lead.socialMediaUrl || "",
      potentialService: lead.potentialService || "",
      status: lead.status || "New",
      notes: lead.notes || "",
      assignedTo:
        typeof lead.assignedTo === "object"
          ? lead.assignedTo?._id || ""
          : lead.assignedTo || "",
      followUpDate: lead.followUpDate
        ? lead.followUpDate.slice(0, 10)
        : "",
    });

    setError("");
    setSuccess("");
    setShowDetails(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedLead(null);
    setForm({ ...emptyForm });
  };

  // Update only an already assigned lead.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLead?._id) return;

    const isAssigned = assignedLeads.some(
      (lead) => String(lead._id) === String(selectedLead._id)
    );

    if (!isAssigned) {
      setError("You can only update leads assigned to you.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${apiUrl}/api/team-member/member-leads/update-lead/${selectedLead._id}`,
        {
          ...form,
          // A team member cannot reassign the lead.
          assignedTo:
            typeof selectedLead.assignedTo === "object"
              ? selectedLead.assignedTo?._id
              : selectedLead.assignedTo,
        },
        { headers }
      );

      const updatedLead = response.data.data;

      dispatch(updateLead(updatedLead));

      setSelectedLead(updatedLead);
      closeForm();
      resetSearch();
      setSuccess("Lead updated successfully.");
    } catch (err) {
      console.error(
        "Lead update failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Could not update lead. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    if (
      !lead?._id ||
      lead.status === newStatus ||
      savingLeadId === lead._id
    ) {
      return;
    }

    const isAssigned = assignedLeads.some(
      (item) => String(item._id) === String(lead._id)
    );

    if (!isAssigned) {
      setError("You can only update leads assigned to you.");
      return;
    }

    setSavingLeadId(lead._id);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${apiUrl}/api/team-member/member-leads/update-lead/${lead._id}`,
        {
          ...lead,
          status: newStatus,
          assignedTo:
            typeof lead.assignedTo === "object"
              ? lead.assignedTo?._id
              : lead.assignedTo,
        },
        { headers }
      );

      const updatedLead = response.data.data;

      dispatch(updateLead(updatedLead));

      setSearchResults((prev) =>
        prev === null
          ? null
          : prev.map((item) =>
              item._id === updatedLead._id ? updatedLead : item
            )
      );

      setSelectedLead((prev) =>
        prev?._id === updatedLead._id ? updatedLead : prev
      );

      setSuccess("Lead status updated successfully.");
    } catch (err) {
      console.error(
        "Status update failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Could not update status. Please try again."
      );
    } finally {
      setSavingLeadId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "No date";

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getUserName = (lead) => {
    if (!lead?.assignedTo) return "Unassigned";

    if (typeof lead.assignedTo === "object") {
      return (
        lead.assignedTo.name ||
        lead.assignedTo.fullName ||
        currentUser?.name ||
        "Assigned to you"
      );
    }

    return currentUser?.name || "Assigned to you";
  };

  const filteredLeads = leads.filter((lead) => {
    const statusMatch =
      status === "All" || lead.status === status;

    const categoryMatch =
      category === "All" || lead.category === category;

    const serviceMatch =
      service === "All" ||
      lead.potentialService === service;

    return statusMatch && categoryMatch && serviceMatch;
  });

  const totalLeads = assignedLeads.length;

  const newLeads = assignedLeads.filter(
    (lead) => lead.status === "New"
  ).length;

  const wonLeads = assignedLeads.filter(
    (lead) => lead.status === "Won"
  ).length;

  const followUpLeads = assignedLeads.filter(
    (lead) => lead.followUpDate
  ).length;

  if (!currentUserId) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold text-ink">
          Unable to identify your account
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Please check your authentication state and user ID in Redux
          or localStorage.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-x-clip bg-background sm:space-y-6">
      {/* HEADER */}
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="wrap-break-word text-2xl font-bold text-ink">
            My Assigned Leads
          </h1>
          <p className="text-sm text-ink-secondary sm:text-base">
            View your assigned leads and manage their progress.
          </p>
        </div>

   
      </div>

      {/* MESSAGES */}
      {error && (
        <div
          role="alert"
          className="wrap-break-word rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="wrap-break-word rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">My Leads</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {totalLeads}
              </h2>
            </div>
            <Users size={24} className="shrink-0 text-primary" />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">New Leads</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {newLeads}
              </h2>
            </div>
            <User size={24} className="shrink-0 text-primary" />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Won Leads</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {wonLeads}
              </h2>
            </div>
            <CheckCircle2 size={24} className="shrink-0 text-success" />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Follow-ups</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {followUpLeads}
              </h2>
            </div>
            <CalendarClock size={24} className="shrink-0 text-primary" />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="w-full min-w-0 rounded-xl border border-border bg-surface p-3 sm:p-4">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-ink">
              Search
            </label>
            <div className="relative min-w-0">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search leads..."
                onChange={handleSearch}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-ink">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-ink">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-ink">
              Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Services</option>
              {services.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            Showing{" "}
            <span className="font-semibold text-ink">
              {filteredLeads.length}
            </span>{" "}
            leads
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("All");
              setCategory("All");
              setService("All");
            }}
            className="self-start text-sm font-medium text-ink-secondary hover:text-primary sm:self-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* LEADS LIST */}
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
        { assignedLeads.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-muted">
            Loading your assigned leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="px-4 py-12 text-center sm:py-16">
            <Users size={40} className="mx-auto mb-3 text-ink-muted" />
            <h3 className="font-semibold text-ink">No leads found</h3>
            <p className="mt-1 text-sm text-ink-muted">
              No assigned leads match your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 p-3 md:hidden">
              {filteredLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word font-semibold text-ink">
                        {lead.businessName || "Unnamed Business"}
                      </h3>
                      <p className="mt-1 wrap-break-word text-sm text-ink-muted">
                        {lead.category || "No category"}
                      </p>
                    </div>

                    <span
                      className={`max-w-[45%] shrink-0 wrap-break-word rounded-full px-2.5 py-1 text-center text-xs font-medium ${statusClass(
                        lead.status || "New"
                      )}`}
                    >
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div className="mt-4 min-w-0 space-y-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <User size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Contact Person</p>
                        <p className="wrap-break-word text-sm font-medium text-ink">
                          {lead.contactPerson || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <Phone size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Phone</p>
                        <p className="break-all text-sm text-ink">
                          {lead.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Location</p>
                        <p className="wrap-break-word text-sm text-ink">
                          {lead.city || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <Briefcase size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Service</p>
                        <p className="wrap-break-word text-sm text-ink">
                          {lead.potentialService || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {lead.email && (
                      <div className="flex min-w-0 items-start gap-2">
                        <Mail size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-ink-muted">Email</p>
                          <p className="break-all text-sm text-ink">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {lead.followUpDate && (
                      <div className="flex min-w-0 items-start gap-2">
                        <CalendarClock size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-ink-muted">Follow-up Date</p>
                          <p className="text-sm text-ink">
                            {formatDate(lead.followUpDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="min-w-0">
                      <label className="mb-1 block text-xs text-ink-muted">
                        Update Status
                      </label>
                      <select
                        value={lead.status || "New"}
                        disabled={savingLeadId === lead._id}
                        onChange={(e) =>
                          handleStatusChange(lead, e.target.value)
                        }
                        className={inputClass}
                      >
                        {statuses.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
                    <span className="min-w-0 truncate text-xs text-ink-muted">
                      {getUserName(lead)}
                    </span>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowDetails(true);
                        }}
                        className={`${actionButtonClass} text-ink-secondary hover:text-primary`}
                        title="View Lead"
                        aria-label="View lead"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(lead)}
                        className={`${actionButtonClass} text-ink-secondary hover:text-primary`}
                        title="Edit Lead"
                        aria-label="Edit lead"
                      >
                        <Edit3 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden w-full min-w-0 md:block">
              <table className="w-full table-fixed text-left">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="w-[20%] px-3 py-3 text-sm text-ink lg:px-5">
                      Business
                    </th>
                    <th className="w-[20%] px-3 py-3 text-sm text-ink lg:px-5">
                      Contact
                    </th>
                    <th className="w-[13%] px-3 py-3 text-sm text-ink lg:px-5">
                      Location
                    </th>
                    <th className="w-[14%] px-3 py-3 text-sm text-ink lg:px-5">
                      Service
                    </th>
                    <th className="w-[15%] px-3 py-3 text-sm text-ink lg:px-5">
                      Status
                    </th>
                    <th className="w-[18%] px-2 py-3 text-sm text-ink lg:px-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="border-b border-border last:border-0">
                      <td className="min-w-0 px-3 py-4 lg:px-5">
                        <p className="wrap-break-word font-medium text-ink">
                          {lead.businessName || "Unnamed Business"}
                        </p>
                        <p className="mt-1 wrap-break-word text-xs text-ink-muted">
                          {lead.category || "No category"}
                        </p>
                      </td>

                      <td className="min-w-0 px-3 py-4 lg:px-5">
                        <p className="wrap-break-word font-medium text-ink">
                          {lead.contactPerson || "Not provided"}
                        </p>
                        <p className="mt-1 flex min-w-0 items-start gap-1 text-xs text-ink-muted">
                          <Phone size={13} className="mt-0.5 shrink-0" />
                          <span className="break-all">
                            {lead.phone || "No phone"}
                          </span>
                        </p>
                      </td>

                      <td className="min-w-0 px-3 py-4 lg:px-5">
                        <p className="flex min-w-0 items-start gap-1 text-sm text-ink">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span className="wrap-break-word">
                            {lead.city || "—"}
                          </span>
                        </p>
                      </td>

                      <td className="min-w-0 px-3 py-4 text-sm text-ink lg:px-5">
                        <p className="wrap-break-word">
                          {lead.potentialService || "—"}
                        </p>
                      </td>

                      <td className="min-w-0 px-3 py-4 lg:px-5">
                        <select
                          value={lead.status || "New"}
                          disabled={savingLeadId === lead._id}
                          onChange={(e) =>
                            handleStatusChange(lead, e.target.value)
                          }
                          className={`max-w-full rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${statusClass(
                            lead.status || "New"
                          )}`}
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-4 lg:px-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowDetails(true);
                            }}
                            className={`${actionButtonClass} text-ink-secondary hover:text-primary`}
                            title="View Lead"
                            aria-label="View lead"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(lead)}
                            className={`${actionButtonClass} text-ink-secondary hover:text-primary`}
                            title="Edit Lead"
                            aria-label="Edit lead"
                          >
                            <Edit3 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* DETAILS MODAL */}
      {showDetails && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-2xl overflow-y-auto overflow-x-hidden rounded-xl bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-ink">Lead Details</h2>
                <p className="wrap-break-word text-sm text-ink-muted">
                  {selectedLead.businessName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
                className="shrink-0 rounded-lg p-2 text-ink-secondary hover:bg-background"
                aria-label="Close lead details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-5">
              {[
                ["Business Name", selectedLead.businessName],
                ["Category", selectedLead.category],
                ["Contact Person", selectedLead.contactPerson],
                ["Phone", selectedLead.phone],
                ["Email", selectedLead.email],
                ["City", selectedLead.city],
                ["Potential Service", selectedLead.potentialService],
                ["Assigned To", getUserName(selectedLead)],
                ["Follow-up Date", formatDate(selectedLead.followUpDate)],
                ["Status", selectedLead.status || "New"],
                ["Website", selectedLead.websiteUrl],
                ["Social Media", selectedLead.socialMediaUrl],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <p className="text-sm text-ink-muted">{label}</p>
                  <p
                    className={`font-medium text-ink ${
                      ["Phone", "Email", "Website", "Social Media"].includes(label)
                        ? "break-all"
                        : "wrap-break-word"
                    }`}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}

              <div className="min-w-0 sm:col-span-2">
                <p className="text-sm text-ink-muted">Notes</p>
                <p className="whitespace-pre-wrap wrap-break-word text-ink">
                  {selectedLead.notes || "No notes"}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-5">
              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background sm:w-auto"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => openEditForm(selectedLead)}
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover sm:w-auto"
              >
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FORM — NO ADD OR ASSIGN OPTION */}
      {showForm && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-3xl overflow-y-auto overflow-x-hidden rounded-xl bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
              <div>
                <h2 className="text-xl font-bold text-ink">Edit Lead</h2>
                <p className="text-sm text-ink-muted">
                  Update your assigned lead information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="shrink-0 rounded-lg p-2 text-ink-secondary hover:bg-background"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="min-w-0 space-y-5 p-4 sm:p-5">
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Business Name", "businessName", "text"],
                  ["Contact Person", "contactPerson", "text"],
                  ["Phone", "phone", "text"],
                  ["Email", "email", "email"],
                  ["City", "city", "text"],
                  ["Website URL", "websiteUrl", "url"],
                  ["Social Media URL", "socialMediaUrl", "url"],
                ].map(([label, name, type]) => (
                  <div key={name} className="min-w-0">
                    <label className="mb-1 block text-sm font-medium text-ink">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className={inputClass}
                      required={name === "businessName"}
                    />
                  </div>
                ))}

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Potential Service
                  </label>
                  <select
                    name="potentialService"
                    value={form.potentialService}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Service</option>
                    {services.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-full rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
                >
                  {saving ? "Saving..." : "Update Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
