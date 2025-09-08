const express = require("express");
const router = express.Router();


const { resumeDataExtraction } = require("../controllers/resumeController");

router.post("/resume-upload", resumeDataExtraction);

module.exports = router;