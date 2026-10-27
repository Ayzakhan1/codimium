import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addLead,
  updateLead,
  removeLead,
} from "../../redux/slices/leadSlice";

import {
  CalendarClock,
  CheckCircle2,
  Edit3,
  Eye,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
  X,
  Mail,
  Briefcase,
  Download,
  Upload,
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

const users = [
  { id: "1", name: "Ali Khan" },
  { id: "2", name: "Ahmad" },
  { id: "3", name: "Abdullah" },
];

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

const inputClass =
  "w-full min-w-0 max-w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-lg p-2 transition hover:bg-background";

export default function Leads() {
  const dispatch = useDispatch();

  const reduxLeads = useSelector(
    (state) => state.leads.leads || []
  );

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);

  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [service, setService] = useState("All");

  const [form, setForm] = useState(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [teamMembers, setTeamMembers] = useState([]);

  // CSV import states
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const leads = searchResults ?? reduxLeads;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/team_member/get-team-members`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setTeamMembers(response.data.users || []);
      } catch (error) {
        console.error(
          "Error fetching team members:",
          error.response?.data || error.message
        );
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewLead = () => {
    setForm({ ...emptyForm });
    setSelectedLead(null);
    setShowForm(true);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedLead(null);
    setForm({ ...emptyForm });
  };

  // CSV export
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }

    const text =
      typeof value === "object"
        ? value.name || value._id || ""
        : String(value);

    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportCSV = () => {
    if (!reduxLeads.length) {
      alert("Export karne ke liye koi leads nahi hain.");
      return;
    }

    const headers = [
      "businessName",
      "contactPerson",
      "phone",
      "email",
      "city",
      "category",
      "websiteUrl",
      "socialMediaUrl",
      "potentialService",
      "status",
      "notes",
      "assignedTo",
      "followUpDate",
    ];

    const rows = reduxLeads.map((lead) =>
      headers
        .map((header) => {
          let value = lead[header];

          if (header === "followUpDate" && value) {
            value = String(value).slice(0, 10);
          }

          return escapeCSV(value);
        })
        .join(",")
    );

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // CSV parser: quoted commas and escaped quotes supported
  const parseCSV = (text) => {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(field.trim());
        field = "";
      } else if (
        (char === "\n" || char === "\r") &&
        !inQuotes
      ) {
        if (char === "\r" && next === "\n") i++;

        row.push(field.trim());

        if (row.some((value) => value !== "")) {
          rows.push(row);
        }

        row = [];
        field = "";
      } else {
        field += char;
      }
    }

    row.push(field.trim());

    if (row.some((value) => value !== "")) {
      rows.push(row);
    }

    if (rows.length < 2) return [];

    const normalizeHeader = (header) =>
      header
        .replace(/^\uFEFF/, "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]/g, "");

    const headers = rows.shift().map(normalizeHeader);

    const headerMap = {
      businessname: "businessName",
      contactperson: "contactPerson",
      phone: "phone",
      email: "email",
      city: "city",
      category: "category",
      website: "websiteUrl",
      websiteurl: "websiteUrl",
      socialmediaurl: "socialMediaUrl",
      potentialservice: "potentialService",
      service: "potentialService",
      status: "status",
      notes: "notes",
      assignedto: "assignedTo",
      followupdate: "followUpDate",
    };

    return rows.map((values) => {
      const lead = {};

      headers.forEach((header, index) => {
        const fieldName = headerMap[header];

        if (fieldName) {
          lead[fieldName] = values[index] || "";
        }
      });

      return lead;
    });
  };

  // CSV import through the existing add-lead API
  const importCSV = async (event) => {
    const file = event.target.files?.[0];

    // Same file can be selected again
    event.target.value = "";

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please CSV file select karein.");
      return;
    }

    setImporting(true);

    try {
      const text = await file.text();
      const importedRows = parseCSV(text);

      if (!importedRows.length) {
        alert("CSV empty hai ya uska format sahi nahi hai.");
        return;
      }

      let successCount = 0;
      let failedCount = 0;

      for (const row of importedRows) {
        if (!row.businessName?.trim()) {
          failedCount++;
          continue;
        }

        const leadData = {
          ...emptyForm,
          ...row,
          businessName: row.businessName.trim(),
          contactPerson: row.contactPerson?.trim() || "",
          phone: row.phone?.trim() || "",
          email: row.email?.trim() || "",
          city: row.city?.trim() || "",
          category: row.category?.trim() || "",
          websiteUrl: row.websiteUrl?.trim() || "",
          socialMediaUrl: row.socialMediaUrl?.trim() || "",
          potentialService: row.potentialService?.trim() || "",
          status: statuses.includes(row.status)
            ? row.status
            : "New",
          notes: row.notes?.trim() || "",
          assignedTo: row.assignedTo?.trim() || "",
          followUpDate: row.followUpDate?.trim() || "",
        };

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/leads/add-lead`,
            leadData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          dispatch(addLead(response.data.data));
          successCount++;
        } catch (error) {
          failedCount++;

          console.error(
            `Import failed for ${leadData.businessName}:`,
            error.response?.data || error.message
          );
        }
      }

      resetSearch();

      alert(
        `CSV import complete!\nSuccessful: ${successCount}\nFailed or skipped: ${failedCount}`
      );
    } catch (error) {
      console.error("CSV import error:", error);
      alert("CSV file read nahi ho saki.");
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedLead) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/leads/update-lead/${selectedLead._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(updateLead(response.data.data));

        closeForm();
        resetSearch();
      } catch (error) {
        console.error(
          "Error updating lead:",
          error.response?.data || error.message
        );
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/leads/add-lead`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(addLead(response.data.data));

        closeForm();
        resetSearch();
      } catch (error) {
        console.error(
          "Error adding lead:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteLead?._id) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/leads/delete-lead/${deleteLead._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(removeLead(deleteLead._id));

      console.log("Lead deleted:", response.data);

      setShowDelete(false);
      setDeleteLead(null);
      resetSearch();
    } catch (error) {
      console.error(
        "Error deleting lead:",
        error.response?.data || error.message
      );
    }
  };

  const searchLeads = async (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/leads/search-leads/${encodeURIComponent(value.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error(
        "Search Error:",
        error.response?.data || error.message
      );

      setSearchResults([]);
    }
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

    setShowForm(true);
  };

  const openDeleteModal = (lead) => {
    setDeleteLead(lead);
    setShowDelete(true);
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getUserName = (lead) => {
    if (!lead?.assignedTo) return "Unassigned";

    const assignedId =
      typeof lead.assignedTo === "object"
        ? lead.assignedTo?._id
        : lead.assignedTo;

    const teamMember = teamMembers.find(
      (member) => String(member._id) === String(assignedId)
    );

    if (teamMember) return teamMember.name;

    const user = users.find(
      (item) => item.id === String(assignedId)
    );

    return user ? user.name : "Assigned";
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

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "Won"
  ).length;

  const followUpLeads = leads.filter(
    (lead) => lead.followUpDate
  ).length;

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

  const LeadActions = ({ lead }) => (
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

      <button
        type="button"
        onClick={() => openDeleteModal(lead)}
        className={`${actionButtonClass} text-error hover:bg-red-50`}
        title="Delete Lead"
        aria-label="Delete lead"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-x-clip bg-background sm:space-y-6">
      {/* HEADER */}
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="wrap-break-word text-2xl font-bold text-ink">
            CRM Management
          </h1>
          <p className="text-sm text-ink-secondary sm:text-base">
            Manage your leads and customers
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={importCSV}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-ink transition hover:bg-background disabled:opacity-50 sm:w-fit"
          >
            <Upload size={18} />
            {importing ? "Importing..." : "Import CSV"}
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-ink transition hover:bg-background sm:w-fit"
          >
            <Download size={18} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={addNewLead}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-white transition hover:bg-primary-hover sm:w-fit"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-ink-muted">Total Leads</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {totalLeads}
              </h2>
            </div>
            <Users size={24} className="shrink-0 text-primary" />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
      <div className="w-full min-w-0 max-w-full rounded-xl border border-border bg-surface p-3 sm:p-4">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-ink">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              placeholder="Search leads..."
              onChange={searchLeads}
              className={inputClass}
            />
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
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-surface">
        {filteredLeads.length === 0 ? (
          <div className="px-4 py-12 text-center sm:py-16">
            <Users size={40} className="mx-auto mb-3 text-ink-muted" />
            <h3 className="font-semibold text-ink">No leads found</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Try changing your filters or add a new lead.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 p-3 md:hidden">
              {filteredLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-background p-4"
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
                      <User
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">
                          Contact Person
                        </p>
                        <p className="wrap-break-word text-sm font-medium text-ink">
                          {lead.contactPerson || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <Phone
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Phone</p>
                        <p className="break-all text-sm text-ink">
                          {lead.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Location</p>
                        <p className="wrap-break-word text-sm text-ink">
                          {lead.city || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <Briefcase
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink-muted">Service</p>
                        <p className="wrap-break-word text-sm text-ink">
                          {lead.potentialService || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {lead.email && (
                      <div className="flex min-w-0 items-start gap-2">
                        <Mail
                          size={16}
                          className="mt-0.5 shrink-0 text-ink-muted"
                        />
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
                        <CalendarClock
                          size={16}
                          className="mt-0.5 shrink-0 text-ink-muted"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-ink-muted">
                            Follow-up Date
                          </p>
                          <p className="wrap-break-word text-sm text-ink">
                            {formatDate(lead.followUpDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
                    <span className="min-w-0 truncate text-xs text-ink-muted">
                      {getUserName(lead)}
                    </span>
                    <LeadActions lead={lead} />
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden w-full min-w-0 md:block">
              <table className="w-full table-fixed text-left">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="w-[21%] px-3 py-3 text-sm text-ink lg:px-5">
                      Business
                    </th>
                    <th className="w-[21%] px-3 py-3 text-sm text-ink lg:px-5">
                      Contact
                    </th>
                    <th className="w-[14%] px-3 py-3 text-sm text-ink lg:px-5">
                      Location
                    </th>
                    <th className="w-[16%] px-3 py-3 text-sm text-ink lg:px-5">
                      Service
                    </th>
                    <th className="w-[13%] px-3 py-3 text-sm text-ink lg:px-5">
                      Status
                    </th>
                    <th className="w-[15%] px-2 py-3 text-sm text-ink lg:px-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="min-w-0 px-3 py-4 lg:px-5">
                        <p className="wrap-break-word font-medium text-ink">
                          {lead.businessName || "Unnamed Business"}
                        </p>
                        <p className="mt-1 wrap-break-word text-xs text-ink-muted">
                          {lead.category}
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
                        <p className="flex min-w-0 items-start gap-1 wrap-break-word text-sm text-ink">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0"
                          />
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
                        <span
                          className={`inline-block max-w-full wrap-break-word rounded-full px-2 py-1 text-xs font-medium ${statusClass(
                            lead.status || "New"
                          )}`}
                        >
                          {lead.status || "New"}
                        </span>
                      </td>

                      <td className="px-2 py-4 lg:px-4">
                        <LeadActions lead={lead} />
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
                <h2 className="text-xl font-bold text-ink">
                  Lead Details
                </h2>
                <p className="wrap-break-word text-sm text-ink-muted">
                  {selectedLead.businessName}
                </p>
              </div>

              <button
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
              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Business Name</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.businessName || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Category</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.category || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Contact Person</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.contactPerson || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Phone</p>
                <p className="break-all font-medium text-ink">
                  {selectedLead.phone || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Email</p>
                <p className="break-all font-medium text-ink">
                  {selectedLead.email || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">City</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.city || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Potential Service</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.potentialService || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Assigned To</p>
                <p className="wrap-break-word font-medium text-ink">
                  {getUserName(selectedLead)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Follow-up Date</p>
                <p className="wrap-break-word font-medium text-ink">
                  {formatDate(selectedLead.followUpDate)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Status</p>
                <p className="wrap-break-word font-medium text-ink">
                  {selectedLead.status || "New"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Website</p>
                <p className="break-all font-medium text-ink">
                  {selectedLead.websiteUrl || "No website"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted">Social Media</p>
                <p className="break-all font-medium text-ink">
                  {selectedLead.socialMediaUrl || "No social media link"}
                </p>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <p className="text-sm text-ink-muted">Notes</p>
                <p className="whitespace-pre-wrap wrap-break-word text-ink">
                  {selectedLead.notes || "No notes"}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-5">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background sm:w-auto"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowDetails(false);
                  openEditForm(selectedLead);
                }}
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover sm:w-auto"
              >
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-3xl overflow-y-auto overflow-x-hidden rounded-xl bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-ink">
                  {selectedLead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="text-sm text-ink-muted">
                  Enter lead information below
                </p>
              </div>

              <button
                onClick={closeForm}
                className="shrink-0 rounded-lg p-2 text-ink-secondary hover:bg-background"
                aria-label="Close lead form"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="min-w-0 space-y-5 p-4 sm:p-5"
            >
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

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
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Social Media URL
                  </label>
                  <input
                    type="url"
                    name="socialMediaUrl"
                    value={form.socialMediaUrl}
                    onChange={handleChange}
                    className={inputClass}
                  />
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
                      <option key={item} value={item}>
                        {item}
                      </option>
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
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
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
                  className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover sm:w-auto"
                >
                  {selectedLead ? "Update Lead" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && deleteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto w-full min-w-0 max-w-md overflow-hidden rounded-xl bg-surface">
            <div className="p-4 sm:p-5">
              <h2 className="text-xl font-bold text-ink">
                Delete Lead
              </h2>
              <p className="mt-2 wrap-break-word text-ink-secondary">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-ink">
                  {deleteLead.businessName}
                </span>
                ?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-5">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteLead(null);
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="w-full rounded-lg bg-error px-4 py-2 text-white hover:bg-red-700 sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}