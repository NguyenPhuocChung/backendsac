const pond = require("../models/pondModel");
//get all
const getAllPonds = async (req, res) => {
  try {
    const ponds = await pond.find();
    res.json(ponds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
const getPondById = async (req, res) => {
  try {
    const pond = await pond.findById(req.params.id);
    if (!pond) return res.status(404).json({ message: "Pond not found" });
    res.json(pond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create pond
const createPond = async (req, res) => {
  const newPond = req.body;
  console.log(newPond);

  try {
    // Create an instance of the Pond model
    const pondInstance = new pond(newPond);

    // Save the instance to the database
    const savedPond = await pondInstance.save();

    // Return the saved pond
    res.status(201).json(savedPond);
  } catch (error) {
    // Handle any errors that occur
    res.status(400).json({ message: error.message });
  }
};

//update pond
const updatePond = async (req, res) => {
  try {
    const updatedPond = await pond.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPond)
      return res.status(404).json({ message: "Pond not found" });
    res.json(updatedPond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete pond
const deletePond = async (req, res) => {
  try {
    const deletedPond = await pond.findByIdAndDelete(req.params.id);
    if (!deletedPond)
      return res.status(404).json({ message: "Pond not found" });
    res.json(deletedPond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPonds,
  getPondById,
  createPond,
  deletePond,
  updatePond,
};
