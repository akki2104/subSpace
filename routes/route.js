const express = require("express");
const router = express.Router();

//import controllers
const { final } = require("../controllers/blog-stats")
const blogSearch = require("../controllers/blog-search")


//routes
router.get("/blog-stats", final);
router.get("/blog-search", blogSearch)

module.exports = router;