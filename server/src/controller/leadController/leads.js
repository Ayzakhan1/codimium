const Leads = require('../../models/leads');

const addLeads = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("ASSIGNED TO FROM BODY:", req.body.assignedTo);

    const leadData = {
      ...req.body,
      assignedTo: req.body.assignedTo || null,
    };

    console.log("LEAD DATA:", leadData);

    const dataToSave = new Leads(leadData);

    const savedData = await dataToSave.save();

    res.status(201).json({
      message: "Lead added successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("ADD LEAD ERROR:", error);

    res.status(500).json({
      message: "Error adding lead",
      error: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Leads.find();

    res.status(200).json({
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    res.status(500).json({
      message: "Error fetching leads",
      error: error.message,
    });
  }
};

const deleteLead =  async (req, res)=>{
    try{
       const { id } = req.params;
        const lead = await Leads.deleteOne({ _id: id });
        console.log(req.params)
        res.status(200).json({message:'Lead delated succesfully', data :lead});
    }
    catch(error){
        console.log(error);
        res.status(500).json({messsage:'interner server error'});
    }
};

module.exports ={
    addLeads,
    getLeads,
    deleteLead
};