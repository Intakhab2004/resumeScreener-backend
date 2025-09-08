const axios = require("axios");

const SKILL_SET = {
    "Python": ["python"],
    "JavaScript": ["javascript", "js"],
    "Node.js": ["node.js", "nodejs", "node"],
    "React": ["react", "reactjs", "react.js"],
    "MongoDB": ["mongodb", "mongo"],
    "Express": ["express", "expressjs", "express.js"],
    "C++": ["c++", "cpp"],
    "Java": ["java"],
    "SQL": ["sql", "mysql", "postgresql", "postgres", "mssql", "sql server", "oracle"],
    "AWS": ["aws", "amazon web services"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"]
}


const SECTION_KEYWORDS = {
    EXPERIENCE: ["worked at", "experience", "role", "responsible for", "employed at"],
    PROJECTS: ["project", "developed", "created", "built"],
    EDUCATION: ["university", "college", "degree", "bachelor", "master", "phd", "graduated"],
    CERTIFICATION: ["certificate", "certified", "certification", "course"]
}

const TECH_KEYWORDS = Object.values(SKILL_SET).flat();

async function extractResumeData(text){
    try{
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/dslim/bert-base-NER",
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        )
        const entities = response.data;
        console.log(entities);

        // Extracting the name of the candidate
        const personName = entities.find(e => e.entity_group.includes("PER"))?.word || "";

        // Extract skills using SKILL_SET
        const words = entities.map(e => e.word.toLowerCase());
        const skills = [];
        for(let [skill, variants] of Object.entries(SKILL_SET)){
            if(variants.some(v => words.some(word => word.includes(v.toLowerCase())))){
                skills.push(skill);
            }
        }

        // Splitting the text on the basis of new line or multiple new lines and then removing the leading and trailing spaces and then filter 
        // the list for removing the empty string
        const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l);


        const result = {
            name: personName,
            skills,
            experience: [],
            projects: [],
            education: [],
            certification: []
        }

        for(let line of lines){
            const lowerLine = line.toLowerCase();

            // Experience
            if(SECTION_KEYWORDS.EXPERIENCE.some(k => lowerLine.includes(k))){
                const org = entities.find(e => line.includes(e.word) && e.entity_group.includes("ORG"))?.word || "";
                const role = entities.find(e => line.includes(e.word) && e.entity_group.includes("TITLE"))?.word || "";

                const durationMatches = line.match(/(\b\d{4}\b)/g);
                const duration = durationMatches ? durationMatches.join(" - ") : "";

                result.experience.push({
                    company: org,
                    role: role,
                    duration: duration,
                    description: line
                })
                continue;
            }

            // Projects
            if(SECTION_KEYWORDS.PROJECTS.some(k => lowerLine.includes(k))){
                const techStack = TECH_KEYWORDS.filter(tech => lowerLine.includes(tech.toLowerCase()));

                // Optional: extract project link if URL present
                const urlMatch = line.match(/\b((https?:\/\/)|(www\.))[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?\b/g);
                const link = urlMatch ? urlMatch[0] : "";

                // Extract project title (optional: take first few words)
                const title = line.split(".")[0]; 

                result.projects.push({
                    title,
                    description: line,
                    techStack,
                    link
                })
                continue;
            }

            // Education
            if(SECTION_KEYWORDS.EDUCATION.some(k => lowerLine.includes(k))){
                const degree = entities.find(e => line.includes(e.word) && e.entity_group.includes("TITLE"))?.word || "";
                const institution = entities.find(e => line.includes(e.word) && e.entity_group.includes("ORG"))?.word || "";
                const yearMatch = line.match(/\b(19|20)\d{2}\b/g);
                const cgpaMatch = line.match(/\b(?:10(?:\.0{1,2})?|[0-9](?:\.[0-9]{1,2})?|100(?:\.0{1,2})?)%?\b/g);

                result.education.push({
                    degree,
                    institution,
                    year: yearMatch ? yearMatch[0] : "",
                    cgpa: cgpaMatch ? cgpaMatch[0] : ""
                })
                continue;
            }

            // Certification
            if(SECTION_KEYWORDS.CERTIFICATION.some(k => lowerLine.includes(k))){
                result.certification.push(line);
            }
        }

        // Removing duplicates from certifications
        result.certification = [...new Set(result.certification)];
        return result;

    }

    catch(error){
        console.log("Something went wrong while extracting skills");
        console.error("An error occured: ", error);

        return {
            name: "",
            skills: [],
            experience: [],
            projects: [],
            education: [],
            certification: []
        }
    }
}

module.exports = extractResumeData;


