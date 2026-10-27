const User = require("../../models/user");

const getTeamMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "team_member" })
      .select("_id name email");

    res.status(200).json({
      message: "Team members fetched successfully",
      users: members,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching team members",
      error: error.message,
    });
  }
};

module.exports = {
     getTeamMembers 
    };
