const mongoose = require("mongoose");

const candidateScoreSchema = new mongoose.Schema({
    cnadidateId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    jobId: {
        type: mongoose.Types.ObjectId,
        ref: "JobDescription"
    },

    resumeId: {
        type: mongoose.Types.ObjectId,
        ref: "Resume"
    },

    score: {
        type: Number
    },

    matchedSkills: [{
        type: String
    }],

    missingSkills: [{
        type: String
    }],
})

const candidateScoreModel = mongoose.model("CandidateScore", candidateScoreSchema);
module.exports = candidateScoreModel;
