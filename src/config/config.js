const dotenv = require('dotenv');
dotenv.config();

const configuration = {
    dbUrl: process.env.DATABASE_URL,
    jwtCode: process.env.JWT_SECRET_CODE,
    jwtExpireTime: process.env.SESSION_TIME || "5s"
}

module.exports = { configuration };