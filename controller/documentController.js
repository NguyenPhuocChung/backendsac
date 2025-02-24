const Docu = require("../models/documentModels");
//get all documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Docu.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get document by id
const getDocumentById = async (req, res) => {
  try {
    const document = await Docu.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create document
const createDocument = async (req, res) => {
  const { title, content } = req.body;

  const newDocument = new Docu({ title, content });

  try {
    const document = await newDocument.save();
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update document
const updateDocument = async (req, res) => {
  const { title, content } = req.body;

  try {
    const document = await Docu.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Docu.findByIdAndDelete(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
  createDocument,
};
