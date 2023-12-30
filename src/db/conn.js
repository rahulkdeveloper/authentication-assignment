const mongoose = require("mongoose");
const { configuration } = require('../config/config')

function dbConnection() {
    const url = configuration.dbUrl;
    mongoose.connect(url)
        .then(() => console.log("db connected..."))
        .catch((err) => console.log("Error in connected db", err))
}

module.exports = { dbConnection };