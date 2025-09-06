function employerRejectedTemplate(name, reason) {
    return `
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f1f1;">
                <h1 style="color: #2c3e50; margin: 0;">
                    ❌ Employer Account Rejected
                </h1>
            </div>

            <div style="padding: 20px 0; text-align: center;">
                <h2 style="color: #34495e; margin: 0 0 10px;">
                    Hello, ${name} 👋
                </h2>
                <p style="color: #555; font-size: 15px; margin: 10px 0;">
                    We regret to inform you that your employer account has been 
                    <strong style="color: red;">rejected</strong>.
                </p>
                <p style="color: #555; font-size: 15px; margin: 10px 0;">
                    Reason for rejection:
                </p>
                <div style="display: inline-block; background: #e74c3c; color: #fff; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                    ${reason}
                </div>
                <p style="color: #555; font-size: 15px; margin: 10px 0;">
                    Please review your details, update the required information, and try again.
                </p>
            </div>

            <div style="text-align: center; font-size: 13px; color: #888; margin-top: 30px;">
                <p style="margin: 0;">
                    © ${new Date().getFullYear()} SkillLens. All rights reserved.
                </p>
            </div>
        </div>
    `
}

module.exports = employerRejectedTemplate;
