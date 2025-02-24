const express = require("express");

const routes = express.Router();
const { createPond } = require("../controller/pondController");
routes.post("/addNewPond", createPond);
module.exports = routes;
