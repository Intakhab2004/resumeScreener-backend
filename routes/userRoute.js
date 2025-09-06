const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    verifyCode,
    updateEmployerStatus

} = require("../controllers/auth");

router.post("/sign-up", signup);
router.post("/verify-otp", verifyCode);
router.post("/sign-in", signin);
router.put("/approve-employer/:id", updateEmployerStatus);

module.exports = router;