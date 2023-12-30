const { configuration } = require("../config/config");
const jwt = require('jsonwebtoken');

exports.generateJwtToken = async (payload) => {

    return jwt.sign(payload, configuration.jwtCode, { expiresIn: configuration.jwtExpireTime })
}

exports.verifyJwtToken = async (token) => {
    try {
        return jwt.verify(token, configuration.jwtCode)

    } catch (error) {
        return null
    }
}