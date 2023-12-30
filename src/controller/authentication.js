const User = require("../model/User");
const { comparePassword, hashPassword } = require('../utils/utils');
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../service/jwt.service');
const UserSession = require('../model/UserSession');
const { configuration } = require('../config/config')

exports.register = async (request, response) => {
    try {

        const { password, email, mobile, deviceDetails: { deviceUuid } } = request.body

        // check user alredy exist or not...
        const findUser = await User.findOne({ email }).lean();

        if (findUser) {

            return response.status(400).json({
                success: false,
                message: "Email already exist",
            })
        }

        // check mobile number exist ...
        const findUserByMobile = await User.findOne({ mobile }).lean();
        if (findUserByMobile) {

            return response.status(400).json({
                success: false,
                message: "Mobile number already exist",
            })
        }



        request.body.password = await hashPassword(password);
        request.body.accountVerifyOtp = "123456";
        const newUser = new User(request.body);
        const user = await newUser.save();

        return response.status(201).json({
            success: true,
            message: "Register Successfully",
            data: user,
        })

    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.verifyAccount = async (request, response) => {
    try {
        const { type, email, mobile, otp } = request.body;
        let user;

        if (type === 1 && mobile) {
            user = await User.findOne({ mobile }).lean();
            if (!user) {
                return response.status(404).json({
                    success: false,
                    message: "Wrong mobile number.",
                })
            }

            if (otp !== user.accountVerifyOtp) {
                return response.status(400).json({
                    success: false,
                    message: "Wrong Otp.",
                })
            }

            // update user account is verified...
            await User.findOneAndUpdate({ _id: user._id }, { isAccountVerified: true, accountVerifyOtp: null });
            return response.status(200).json({
                success: true,
                message: "Account verified successfully.",
            })


        }
        else if (type === 2 && email) {
            user = await User.findOne({ email }).lean();
            if (!user) {
                return response.status(404).json({
                    success: false,
                    message: "Wrong email.",
                })
            }

            if (otp !== user.accountVerifyOtp) {
                return response.status(400).json({
                    success: false,
                    message: "Wrong Otp.",
                })
            }

            // update user account is verified...
            await User.findOneAndUpdate({ _id: user._id }, { isAccountVerified: true, accountVerifyOtp: null });
            return response.status(200).json({
                success: true,
                message: "Account verified successfully.",
            })
        }
        else {
            return response.status(400).json({
                success: false,
                message: "All fields are required.",
            })
        }



    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.login = async (request, response) => {
    try {

        const { email, password, deviceDetails } = request.body;
        const userIp = deviceDetails.ipAddress || request.socket.remoteAddress


        // check user alredy exist or not...
        const findUser = await User.findOne({ email }).lean();

        if (!findUser) {

            return response.status(400).json({
                success: false,
                message: "Please login with correct credentials.",
            })
        }

        // check user account verified or not...
        if (!findUser.isAccountVerified) {
            return response.status(400).json({
                success: false,
                message: "Account not verified. Please verify your account first.",
            })
        }

        // compare password...
        const isPasswordValid = await comparePassword(password, findUser.password);
        if (!isPasswordValid) {
            return response.status(400).json({
                success: false,
                message: "Please login with correct credentials.",
            })
        }

        let updateQUery = {
            deviceDetails,
            loginAt: new Date()
        }

        // update login details...
        await User.findOneAndUpdate({ _id: findUser._id }, updateQUery)


        // generate jwt token...
        const accessToken = await generateJwtToken({ _id: findUser._id, deviceUuid: deviceDetails.deviceUuid });

        // check already login from other device...
        const existingSessions = await UserSession.find({ userId: findUser._id }).lean();
        if (existingSessions.length > 0) {
            // delete existing sessions...
            for (let session of existingSessions) {
                await UserSession.findByIdAndDelete({ _id: session._id })
            }
        }

        // create new session for current device...
        const expireTime = configuration.jwtExpireTime || "1h"
        const newSession = new UserSession({ userId: findUser._id, deviceUuid: deviceDetails.deviceUuid, ipAddress: deviceDetails.ipAddress, expiresIn: expireTime })

        await newSession.save()


        return response.status(200).json({
            success: true,
            message: "Login Successfully",
            accessToken
        })

    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.forgotPassword = async (request, response) => {
    try {
        const { email } = request.body;

        // check user alredy exist or not...
        const user = await User.findOne({ email }).lean();

        if (!user) {

            return response.status(404).json({
                success: false,
                message: "Email not found.",
            })
        }

        //set otp for reset password...
        await User.findOneAndUpdate({ _id: user._id }, { forgotPasswordOtp: "123456" })

        return response.status(200).json({
            success: true,
            message: "Otp send on email for reset password.",
        })




    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.resetPassword = async (request, response) => {
    try {
        const { email, otp, newPassword } = request.body;

        // check user alredy exist or not...
        const user = await User.findOne({ email }).lean();

        if (!user) {

            return response.status(404).json({
                success: false,
                message: "Email not found.",
            })
        }

        // verify otp...
        if (user.forgotPasswordOtp !== otp) {
            return response.status(400).json({
                success: false,
                message: "Wrong otp.",
            })
        }

        // hash new password...
        const newHashPassword = await hashPassword(newPassword);

        //update new password
        await User.findOneAndUpdate({ _id: user._id }, { password: newHashPassword, forgotPasswordOtp: null })

        // logout from other device ...
        await UserSession.findOneAndDelete({ userId: user._id });

        return response.status(200).json({
            success: true,
            message: "Password reset successfully.",
        })




    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.logout = async (request, response) => {
    try {
        const userId = request.user._id;



        const session = await UserSession.findOne({ userId }).lean();

        //calculate user active time in minutes...
        const currentTime = Date.now();
        const loginTime = session.createdAt;
        const differenceMs = Math.abs(loginTime - currentTime);

        const differenceMinutes = Math.floor(differenceMs / (1000 * 60));

        // delete session...
        await UserSession.findByIdAndDelete({ _id: session._id });

        // save logout time..
        await User.findByIdAndUpdate({ _id: userId }, { logoutAt: new Date() })



        return response.status(200).json({
            success: true,
            message: "Logout successfully.",
            userActiveTime: `${differenceMinutes} minutes `
        })




    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}