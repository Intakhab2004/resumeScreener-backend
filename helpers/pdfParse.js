const axios = require("axios");
const pdfParse = require("pdf-parse");

exports.extractTextDataFromPDF = async(fileURL) => {
    try{
        const fileBuffer = await axios.get(fileURL, { responseType: "arraybuffer" });

        //converting it to node buffer
        const buffer = Buffer.from(fileBuffer.data);

        //parsing with pdf-parse
        const parsedData = await pdfParse(buffer);

        return parsedData.text;
    }
    catch(error){
        throw new Error("Something went wrong while parsing the pdf");
    }
}