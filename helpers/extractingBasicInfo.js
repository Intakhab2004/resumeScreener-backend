


function regexBasicInfo(text){
    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;
    const phoneRegex = /(\+91[\s-]?)?[0-9]{10}/;

    return {
        email: text.match(emailRegex)?.[0] || null,
        phone: text.match(phoneRegex)?.[0] || null
    }
}

module.exports = regexBasicInfo;