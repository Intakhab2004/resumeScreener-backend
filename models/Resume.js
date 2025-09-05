const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    resumeURL: {
        type: String
    },

    parsedData: {
        name: String,
        email: String,
        phone: String,
        skills: [String],

        experience: [{
            company: String,
            role: String,
            duration: String,
            description: String
        }],

        projects: [{
            title: String,
            description: String,
            techStack: [String],
            link: String
        }],

        education: [{
            degree: String,
            institution: String,
            year: String,
            cgpa: String
        }],

        certification: [String]
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    }
})


const resumeModel = mongoose.model("Resume", resumeSchema);
module.exports = resumeModel;