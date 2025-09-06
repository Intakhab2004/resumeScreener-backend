function employerApprovedTemplate(name) {
    return `
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f1f1;">
                <h1 style="color: #2c3e50; margin: 0;">
                    ✅ Employer Account Approved
                </h1>
            </div>

            <div style="padding: 20px 0; text-align: center;">
                <h2 style="color: #34495e; margin: 0 0 10px;">
                    Congratulations, ${name}! 🎉
                </h2>
                <p style="color: #555; font-size: 15px; margin: 10px 0;">
                    Your employer account has been <strong style="color: green;">approved</strong>.
                </p>
                <p style="color: #555; font-size: 15px; margin: 10px 0;">
                    You can now log in to your SkillLens account using your credentials and start posting jobs, managing candidates, and exploring our platform.
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

module.exports = employerApprovedTemplate;
