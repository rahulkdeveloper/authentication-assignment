const mongoose = require('mongoose');
const { Schema } = require('mongoose')

const UserSessionSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    deviceUuid: {
        type: String
    },
    ipAddress: {
        type: String
    },
    expiresIn: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const UserSession = new mongoose.model("UserSession", UserSessionSchema);

module.exports = UserSession;