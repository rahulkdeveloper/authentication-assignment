const Joi = require("joi");

const middlewareValidation = (schema, property) => {
    return (request, response, next) => {


        const { error } = schema.validate(request.body, { abortEarly: false })

        if (error == null) {
            next()
        }
        else {
            const { details } = error;
            response.status(400).json({
                success: false,
                message: details
            })
        }
    }
}

const schemas = {
    registerBody: Joi.object().keys({
        name: Joi.string().trim().required().min(3).max(20).required(),
        email: Joi.string().trim().email().required(),
        mobile: Joi.string().required().length(10),
        password: Joi.string().required().min(6).max(30),
        deviceDetails: Joi.object().keys({
            deviceName: Joi.string().required(),
            deviceUuid: Joi.string().required(),
            deviceManufacturer: Joi.string().required(),
            deviceVersion: Joi.string().required(),
            deviceOs: Joi.string().required(),
            ipAddress: Joi.string(),
        }).required()
    })
        .unknown(true),
    loginBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required().min(6).max(30),
        deviceDetails: Joi.object().keys({
            deviceName: Joi.string().required(),
            deviceUuid: Joi.string().required(),
            deviceManufacturer: Joi.string().required(),
            deviceVersion: Joi.string().required(),
            deviceOs: Joi.string().required(),
            ipAddress: Joi.string(),
        }).required()
    })
        .unknown(true),
    verifyAccountBody: Joi.object().keys({
        type: Joi.number().valid(1, 2),
        email: Joi.string().trim().email(),
        otp: Joi.string().required().length(6),
        mobile: Joi.string().length(10),
    })
        .unknown(true),
    forgotPasswordBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
    })
        .unknown(true),
    resetPasswordBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        otp: Joi.string().required().length(6),
        newPassword: Joi.string().required().min(6).max(30),
    })
        .unknown(true)

}




module.exports = { middlewareValidation, schemas }