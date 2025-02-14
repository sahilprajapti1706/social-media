const mongoose = require("mongoose")

function connectToDB () {
    mongoose.connect(process.env.MONGODB_CONNECTION_URI)
    .then(() => {
        console.log("Connect to Database successfully")
    })
    .catch((err) => {
        console.log("Error in connecting with Database :", err)
    })
}

module.exports = connectToDB