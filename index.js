const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");

const userRoute = require("./routes/userRoute");


const app = express();
require("dotenv").config();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// TODO: Update it when the frontend is created
app.use(cors());


// Mounting different api-url on routes
app.use("/api/v1/user", userRoute);



const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try{
        await dbConnect();

        app.listen(PORT, () => {
            console.log(`Server is up and running at port no. ${PORT}`);
        })
    }
    catch(error){
        console.log("An error occured: ", error);
    } 
}
startServer();

app.get("/", (req, res) => {
    console.log("Server is running");
    return res.status(200).json({
        success: true,
        message: "Server is running smoothly"
    })
})