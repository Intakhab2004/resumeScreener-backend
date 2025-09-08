const regexBasicInfo = require("../helpers/extractingBasicInfo");
const extractResumeData = require("../helpers/extractOtherData");


async function parseResume(text){
    // extracting basic info
    const basics = regexBasicInfo(text);

    // extracting other resume data
    const nerData = await extractResumeData(text);

    // formatted result
    return {
        name: nerData.name || null,
        email: basics.email,
        phone: basics.phone,
        skills: nerData.skills,
        experience: nerData.experience || [],
        projects: nerData.projects || [],
        education: nerData.education || [],
        certification: nerData.certification || []
    }
}

module.exports = parseResume;