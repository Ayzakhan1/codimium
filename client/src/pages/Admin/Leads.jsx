import { useEffect, useState } from "react";
import axios from "axios";
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
  { id: "2", name: "Ahmed" },
  { id: "3", name: "Sara" },
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

export default function Leads() {
  const [form, setForm] = useState(emptyForm);
  const [leads, setLeads] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);

  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [service, setService] = useState("All");

  // -----------------------------
  // FORM CHANGE
  // -----------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // OPEN ADD FORM
  // -----------------------------

  const addNewLead = () => {
    setForm(emptyForm);
    setSelectedLead(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA:", form);

    if (selectedLead) {
      // -----------------------------
      // UPDATE LEAD API
      // -----------------------------
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/leads/update-lead/${selectedLead._id}`,
          form,
        );
        console.log("Lead updated:", response.data);

        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === selectedLead._id ? response.data.data : lead,
          ),
        );
        setShowForm(false);
      } catch (error) {
        console.log("Error updating lead:", error);
      }
    } else {
      // -----------------------------
      // ADD LEAD API
      // -----------------------------

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/leads/add-leads`,
          form,
        );

        console.log("Lead added:", response.data);
        setLeads((prevLeads) => [...prevLeads, response.data.data]);

        setForm(emptyForm);
        setShowForm(false);
      } catch (error) {
        console.error("Error adding lead:", error);
      }
    }
  };

  // -----------------------------
  // GET LEAD API
  // -----------------------------

  useEffect(() => {
    const getLeads = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/leads/get-leads`,
        );

        console.log("get lEADs:", response.data);

        setLeads(response.data.data);
      } catch (error) {
        console.error("Error getting lead:", error);
      }
    };
    getLeads();
  }, []);

  // -----------------------------
  // DELETE LEAD API
  // -----------------------------

  const handleDelete = async () => {
    if (!deleteLead?._id) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/leads/delete-lead/${deleteLead._id}`,
      );

      console.log("Lead deleted:", response.data);

      setLeads((prevLeads) =>
        prevLeads.filter((lead) => lead._id !== deleteLead._id),
      );

      // Modal close
      setShowDelete(false);
      setDeleteLead(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };


  // -----------------------------
  // EDIT UI ONLY
  // -----------------------------

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
      assignedTo: lead.assignedTo || "",
      followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : "",
    });

    setShowForm(true);
  };

  // -----------------------------
  // DELETE UI ONLY
  // -----------------------------

  const openDeleteModal = (lead) => {
    setDeleteLead(lead);
    setShowDelete(true);
  };

  // -----------------------------
  // DATE FORMAT
  // -----------------------------

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------
  // INITIALS
  // -----------------------------

  // const getInitials = (name) => {
  //   if (!name) return "NA";

  //   return name
  //     .split(" ")
  //     .slice(0, 2)
  //     .map((word) => word[0])
  //     .join("")
  //     .toUpperCase();
  // };

  // -----------------------------
  // ASSIGNED USER
  // -----------------------------

  const getUserName = (lead) => {
    if (!lead?.assignedTo) return "Unassigned";

    const user = users.find((item) => item.id === lead.assignedTo);

    return user ? user.name : "Assigned";
  };

  // -----------------------------
  // FILTERS
  // -----------------------------

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = status === "All" || lead.status === status;

    const categoryMatch = category === "All" || lead.category === category;

    const serviceMatch = service === "All" || lead.potentialService === service;

    return statusMatch && categoryMatch && serviceMatch;
  });

  // -----------------------------
  // COUNTS
  // -----------------------------

  const totalLeads = leads.length;

  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const wonLeads = leads.filter((lead) => lead.status === "Won").length;

  const followUpLeads = leads.filter((lead) => lead.followUpDate).length;

  return (
    <div className="space-y-6 bg-background">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">CRM Management</h1>

          <p className="text-ink-secondary">Manage your leads and customers</p>
        </div>

        <button
          onClick={addNewLead}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-hover"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Total Leads</p>

              <h2 className="mt-1 text-2xl font-bold text-ink">{totalLeads}</h2>
            </div>

            <Users size={24} className="text-primary" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">New Leads</p>

              <h2 className="mt-1 text-2xl font-bold text-ink">{newLeads}</h2>
            </div>

            <User size={24} className="text-primary" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Won Leads</p>

              <h2 className="mt-1 text-2xl font-bold text-ink">{wonLeads}</h2>
            </div>

            <CheckCircle2 size={24} className="text-success" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Follow-ups</p>

              <h2 className="mt-1 text-2xl font-bold text-ink">
                {followUpLeads}
              </h2>
            </div>

            <CalendarClock size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* STATUS */}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>

              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
            >
              <option value="All">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* SERVICE */}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Service
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
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

        {/* FILTER COUNT */}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
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
            className="text-sm font-medium text-ink-secondary hover:text-primary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto mb-3 text-ink-muted" />

            <h3 className="font-semibold text-ink">No leads found</h3>

            <p className="mt-1 text-sm text-ink-muted">
              Add a new lead to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-border bg-background">
                <tr>
                  <th className="px-5 py-3 text-sm text-ink">Business</th>

                  <th className="px-5 py-3 text-sm text-ink">Contact</th>

                  <th className="px-5 py-3 text-sm text-ink">Location</th>

                  <th className="px-5 py-3 text-sm text-ink">Service</th>

                  <th className="px-5 py-3 text-sm text-ink">Status</th>

                  <th className="px-5 py-3 text-sm text-ink">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border last:border-0"
                  >
                    {/* Business */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">
                        {lead.businessName}
                      </p>

                      <p className="text-sm text-ink-muted">{lead.category}</p>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">
                        {lead.contactPerson}
                      </p>

                      <p className="flex items-center gap-1 text-sm text-ink-muted">
                        <Phone size={13} />
                        {lead.phone}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1 text-ink">
                        <MapPin size={14} />
                        {lead.city}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4 text-ink">
                      {lead.potentialService}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-ink">
                      {lead.status || "New"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetails(true);
                          }}
                          className="rounded-lg p-2 text-ink-secondary hover:bg-background hover:text-primary"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => openEditForm(lead)}
                          className="rounded-lg p-2 text-ink-secondary hover:bg-background hover:text-primary"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(lead)}
                          className="rounded-lg p-2 text-error hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}

      {showDetails && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-xl font-bold text-ink">Lead Details</h2>

                <p className="text-sm text-ink-muted">
                  {selectedLead.businessName}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
                className="rounded-lg p-2 text-ink-secondary hover:bg-background"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <div>
                <p className="text-sm text-ink-muted">Business Name</p>

                <p className="font-medium text-ink">
                  {selectedLead.businessName}
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Category</p>

                <p className="font-medium text-ink">{selectedLead.category}</p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Contact Person</p>

                <p className="font-medium text-ink">
                  {selectedLead.contactPerson}
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Phone</p>

                <p className="font-medium text-ink">{selectedLead.phone}</p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Email</p>

                <p className="font-medium text-ink">{selectedLead.email}</p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">City</p>

                <p className="font-medium text-ink">{selectedLead.city}</p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Potential Service</p>

                <p className="font-medium text-ink">
                  {selectedLead.potentialService}
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Assigned To</p>

                <p className="font-medium text-ink">
                  {getUserName(selectedLead)}
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Follow-up Date</p>

                <p className="font-medium text-ink">
                  {formatDate(selectedLead.followUpDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-muted">Status</p>

                <p className="font-medium text-ink">{selectedLead.status}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-ink-muted">Website</p>

                <p className="font-medium text-ink">
                  {selectedLead.websiteUrl || "No website"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-ink-muted">Social Media</p>

                <p className="font-medium text-ink">
                  {selectedLead.socialMediaUrl || "No social media link"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-ink-muted">Notes</p>

                <p className="whitespace-pre-wrap text-ink">
                  {selectedLead.notes || "No notes"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-5">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
                className="rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowDetails(false);
                  openEditForm(selectedLead);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover"
              >
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT FORM MODAL ================= */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {selectedLead ? "Edit Lead" : "Add New Lead"}
                </h2>

                <p className="text-sm text-ink-muted">
                  Enter lead information below
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedLead(null);
                }}
                className="rounded-lg p-2 text-ink-secondary hover:bg-background"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Business Name
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Contact Person
                  </label>

                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Website URL
                  </label>

                  <input
                    type="url"
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Social Media URL
                  </label>

                  <input
                    type="url"
                    name="socialMediaUrl"
                    value={form.socialMediaUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Potential Service
                  </label>

                  <select
                    name="potentialService"
                    value={form.potentialService}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  >
                    <option value="">Select Service</option>

                    {services.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Assigned To
                  </label>

                  <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  >
                    <option value="">Unassigned</option>
                    <option value="1">Ali Khan</option>
                    <option value="1">Ahmad</option>
                    <option value="1">Abdullah</option>

                    {/* {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.name}
                      </option>
                    ))} */}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Follow-up Date
                  </label>

                  <input
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedLead(null);
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover"
                >
                  {selectedLead ? "Update Lead" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {showDelete && deleteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-surface">
            <div className="p-5">
              <h2 className="text-xl font-bold text-ink">Delete Lead</h2>

              <p className="mt-2 text-ink-secondary">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-ink">
                  {deleteLead.businessName}
                </span>
                ?
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-5">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteLead(null);
                }}
                className="rounded-lg border border-border px-4 py-2 text-ink-secondary hover:bg-background"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-error px-4 py-2 text-white hover:bg-red-700"
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
