const sendMail = require("../config/mailConfig");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.signup = async(req, res) => {

    const { name, email, password, confirmPassword, role } = req.body;
    if(!name || !email || !password || !role){
        console.log("All fields are mandatory");
        return res.status(403).json({
            success: false,
            message: "Please fill all the details carefully"
        })
    }

    if(password !== confirmPassword){
        console.log("Both passwords are not matching");
        return res.status(402).json({
            success: false,
            message: "Entered passwords are not same"
        })
    }

    try{
        const otp = Math.floor(Math.random() * 900000 + 100000).toString();
        const otpExpiry = new Date(Date.now() + 60*60*1000);
        const hashedPassword = await bcrypt.hash(password, 10);


        const existingUser = await User.findOne({email});
        if(existingUser){
            if(existingUser.isVerified){
                console.log("User exists with the provided email");

                return res.status(401).json({
                    success: false,
                    message: "User exists with the provided email"
                })
            }

            else{
                existingUser.name = name;
                existingUser.password = hashedPassword;
                existingUser.role = role;
                existingUser.otp = otp;
                existingUser.otpExpiry = otpExpiry;

                await existingUser.save();
            }
        }
        else{
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role,
                otp,
                otpExpiry
            })
            await newUser.save();
        }

        // Sending mail to the user's email
        const mailResponse = await sendMail({email, name, otp});
        if(!mailResponse.success){
            console.log("Something went wrong while sending the mail");
            return res.status(403).json({
                success: false,
                message: mailResponse.message
            })
        }

        return res.status(200).json({
            success: true,
            message: "User created successfully, Please check your email for verification",
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


exports.verifyCode = async(req, res) => {
    const { email, otp } = req.body;

    if(!email || !otp){
        console.log("All fields are required");
        return res.status(404).json({
            success: false,
            message: "All input fields are required"
        })
    }

    try{
        const user = await User.findOne({email});
        if(user.isVerified){
            return res.status(401).json({
                success: false,
                message: "User is already verified"
            })
        }

        const invalidOtp = otp !== user.otp;
        const expiredOtp = new Date(user.otpExpiry) < new Date();

        if(!invalidOtp && !expiredOtp){
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;

            await user.save();
            return res.status(200).json({
                success: true,
                message: "Account verified successfully"
            })

        }

        else if(invalidOtp){
            console.log("Otp is not valid")
            return res.status(403).json({
                success: false,
                message: "The entered otp is not valid"
            })
        }

        else{
            console.log("Otp expired, Please signup again to get the new otp code");
            return res.status(402).json({
                success: false,
                message: "Otp expired, Please signup again to get the new otp code"
            })
        }
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


exports.signin = async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        console.log("All input fields are required");
        return res.status(400).json({
            success: false,
            message: "All fields are mandatory"
        })
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            console.log("User not exists");
            return res.status(404).json({
                success: false,
                message: "User is not registered. Please create account before login."
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account before login"
            })
        }

        if(user.role === "Employer" && !user.approvedEmployer){
            console.log("Employer account is not approved till now");
            return res.status(403).json({
                success: false,
                message: "You have created an employer account, You will only be able to login when Admin verify your details and approve your account"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            console.log("Password is Incorrect");
            return res.status(403).json({
                success: false,
                message: "Password is incorrect"
            })
        }

        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            verifiedUser: user.isVerified,
            approvedEmployer: user.approvedEmployer
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
        user.token = token;
        user.password = undefined;

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            user,
            token,
            message: "User logged in successfully"
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


exports.updateEmployerStatus = async(req, res) => {
    const { id } = req.params;
    const { action, reason } = req.body;

    try{
        const employer = await User.findById(id);
        if(!employer || employer.role !== "Employer"){
            console.log("Employer not found");
            return res.status(404).json({
                success: false,
                message: "Employer not found"
            })
        }

        if(action === "approve"){
            if(employer.approvedEmployer){
                console.log("Employer status is already approved");
                return res.status(403).json({
                    success: false,
                    message: "Employer status is already approved"
                })
            }
            employer.approvedEmployer = true;
        }
        else if(action === "reject"){
            employer.approvedEmployer = false;
        }
        else{
            console.log("Invalid action");
            return res.status(400).json({
                success: false,
                message: "Invalid action, You can only approve or reject the employer"
            })
        }

        await employer.save();

        const mailPayload = {
            email: employer.email,
            name: employer.name,
            action
        }

        // Send reason only for rejection as there is no reason sent from frontend for approval
        if(action === "reject") mailPayload.reason = reason || "No reason provided";

        const mailResponse = await sendMail(mailPayload);
        if(!mailResponse.success){
            console.error("Mail sending failed:", mailResponse.message);
            return res.status(200).json({
                success: true,
                message: `Employer ${action}d successfully, but email could not be sent.`,
                employer,
            })
        }

        return res.status(200).json({
            success: true,
            message: `Employer ${action}d successfully`,
            employer,
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