const mongoose = require("mongoose");

const jobDescSchema = new mongoose.Schema({
    title: {
        type: String
    },

    description: {
        type: String
    },

    reuiredSkills: [{
        type: String
    }],

    minExperience: {
        type: Number,
        default: 0
    },

    location: {
        type: String
    },

    employerId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const jobDescModel = mongoose.model("JobDescription", jobDescSchema);
module.exports = jobDescModel;