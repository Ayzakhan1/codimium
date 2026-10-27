const Leads = require("../../models/leads");

const getTeamMemberLeads = async (req, res) => {
  try {
    const userId = String(
      req.decoded?.id ||
      req.decoded?._id ||
      req.decoded?.userId ||
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token",
      });
    }

    const leads = await Leads.find({
      assignedTo: userId,
    });

    return res.status(200).json({
      message: "Assigned leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    console.error("TEAM MEMBER LEADS ERROR:", error);

    return res.status(500).json({
      message: "Error fetching assigned leads",
    });
  }
};


const searchTeamMemberLeads = async (req, res) => {
  try {
    const key = req.params.key;

    const data = await Leads.find({
      assignedTo: String(
        req.decoded?.id ||
        req.decoded?._id ||
        req.decoded?.userId ||
        ""
      ),
      $or: [
        { businessName: { $regex: new RegExp(key, "i") } },
        { contactPerson: { $regex: new RegExp(key, "i") } },
        { phone: { $regex: new RegExp(key, "i") } },
        { email: { $regex: new RegExp(key, "i") } },
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({
        message: "No assigned leads found",
      });
    }

    return res.status(200).json({
      message: "Successful",
      data,
    });
  } catch (error) {
    console.log("SEARCH TEAM MEMBER LEADS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const updateTeamMemberLead = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = String(
      req.decoded?.id ||
      req.decoded?._id ||
      req.decoded?.userId ||
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token",
      });
    }

    // Sirf apni assigned lead update kar sakta hai
    const response = await Leads.findOneAndUpdate(
  {
    _id: id,
    assignedTo: userId,
  },
  {
    $set: req.body,
  },
  {
    returnDocument: "after",
    runValidators: true,
  }
    );

    if (!response) {
      return res.status(404).json({
        message: "Assigned lead not found",
      });
    }

    return res.status(200).json({
      message: "Lead updated successfully",
      data: response,
    });
  } catch (error) {
    console.log("UPDATE TEAM MEMBER LEAD ERROR:", error);

    return res.status(500).json({
      message: "Error updating lead",
      error: error.message,
    });
  }
};


module.exports = {
  getTeamMemberLeads,
  searchTeamMemberLeads,
  updateTeamMemberLead,
};
