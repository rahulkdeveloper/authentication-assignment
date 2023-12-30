const fs = require('fs')
const User = require('../model/User');
const path = require('path');


exports.uploadProfileImage = async (request, response) => {
    try {
        const userId = request.user._id

        const imageBuffer = request.file.buffer;
        const base64Image = imageBuffer.toString('base64');

        //update user profileImage...
        await User.findByIdAndUpdate({ _id: userId }, { profileImage: base64Image });

        return response.status(200).json({
            success: true,
            message: "Profile image uploaded successfully."
        })


    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.loadProfile = async (request, response) => {
    try {
        const userId = request.user._id

        const userDetails = await User.findOne({ _id: userId }, { password: false }).lean();

        const bufferFile = Buffer.from(userDetails.profileImage, 'base64');


        return response.status(200).json({
            success: true,
            message: "success",
            data: userDetails
        })


    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}