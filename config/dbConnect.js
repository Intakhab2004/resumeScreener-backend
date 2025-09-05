const mongoose = require("mongoose");

async function dbConnect(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Server connected with the DB successfully");
    }
    catch(error){
        console.log("Something went wrong while connecting with database");
        console.error("An error occured: ", error);
        process.exit(1);
    }
}

module.exports = dbConnect;