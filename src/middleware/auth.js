const { configuration } = require('../config/config')
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const UserSession = require('../model/UserSession');


exports.auth = async (request, response, next) => {
    try {

        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Unauthorized.",
            })
        }
        const decode = await jwt.verify(token, configuration.jwtCode);

        if (!decode) {
            return response.status(403).json({
                success: false,
                message: "Access Denied.",
            })
        }
        const user = await User.findOne({ _id: decode._id }).lean();

        if (!user) {
            return response.status(403).json({
                success: false,
                message: "Access Denied.",
            })
        }

        // invalidate token when user has been logout and session deleted...
        const sessions = await UserSession.find({ userId: user._id }).lean();
        if (sessions.length === 0) {
            return response.status(401).json({
                success: false,
                message: "Unauthorized.",
            })
        }




        request.user = { _id: user._id, email: user.email };
        next()

    } catch (error) {
        console.log("Error", error);
        let message = "Unauthorized."

        if (error.message === "jwt expired") {
            message = "token expired please login."
        }
        return response.status(401).json({
            success: false,
            message
        })
    }
}