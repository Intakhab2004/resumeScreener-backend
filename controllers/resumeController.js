const { extractTextDataFromPDF } = require("../helpers/pdfParse");
const parseResume = require("../services/resumeParser");
const Resume = require("../models/Resume");
const cloudinary = require("cloudinary").v2;



exports.resumeDataExtraction = async(req, res) => {
    try{
        const file = req.files.file;
        if(!file){
            console.log("File not provided");
            return res.status(404).json({
                success: false,
                message: "File is not provied, Please provide some file"
            })
        }

        if(file.mimetype !== "application/pdf"){
            console.log("File not supported");
            return res.status(400).json({
                success: false,
                message: "Only PDFs file allowed"
            })
        }

        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: process.env.FOLDER_NAME,
            resource_type: "raw"
        })
        const textData = await extractTextDataFromPDF(uploadResult.secure_url);

        const parsedData = await parseResume(textData);

        const newResume = await Resume.create({
            // candidateId: req.user.id,
            resumeURL: uploadResult.secure_url,
            parsedData,
            isActiveResume: true
        })

        return res.status(200).json({
            success: true,
            message: "Resume uploaded and parsed successfully",
            newResume
        })
    }
    catch(error){
        console.log("Something went wrong");
        console.error("An error occured: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}