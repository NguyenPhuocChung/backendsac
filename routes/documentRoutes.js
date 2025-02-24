const express = require("express");
const passport = require("passport");

const routes = express.Router();
const { getAllDocuments } = require("../controller/documentController");
routes.post("/getALlDocument", getAllDocuments);
module.exports = routes;
