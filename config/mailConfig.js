const nodemailer = require("nodemailer");
const otpTemplate = require("../emails/otpVerification");
const employerApprovedTemplate = require("../emails/employerApproved");
const employerRejectedTemplate = require("../emails/employerRejected");


const sendMail = async({email, name, otp, action, reason}) => {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let subject, html;
        if(otp){
            subject = "SkillLens | Verification code";
            html = otpTemplate(email, name, otp);
        }
        else if(action === "approve"){
            subject = "SkillLens | Employer Account Approved";
            html = employerApprovedTemplate(name);
        } 
        else if(action === "reject"){
            subject = "SkillLens | Employer Account Rejected";
            html = employerRejectedTemplate(name, reason);
        }
        else throw new Error("Invalid mail type: Missing otp or action");
        

        const mailOptions = {
            from: `SkillLens ${process.env.MAIL_USER}`,
            to: email,
            subject,
            html
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        if(mailResponse.accepted.length <= 0){
            return {
                success: false,
                status: 403,
                message: "Something went wrong while sending the mail"
            }
        }

        return {
            success: true,
            status: 200,
            message: "Verification code sent successfully"
        }
    }
    catch(error){
        console.log("An error occured while sending mail: ", error.message);
        return {
            success: false,
            status: 500,
            message: "Internal server error"
        }
    }
}

module.exports = sendMail;