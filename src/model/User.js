const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    loginAt: {
        type: Date,
    },
    deviceDetails: {
        deviceName: {
            type: String
        },
        deviceUuid: {
            type: String
        },
        deviceManufacturer: {
            type: String
        },
        deviceVersion: {
            type: String
        },
        deviceOs: {
            type: String
        },
        ipAddress: {
            type: String
        }
    },
    logoutAt: {
        type: Date,
    },
    coordinates: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    profileImage: {
        type: String
    },
    accountVerifyOtp: {
        type: String
    },
    forgotPasswordOtp: {
        type: String
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
})

const User = new mongoose.model("User", UserSchema);

module.exports = User;