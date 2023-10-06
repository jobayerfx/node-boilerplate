const S = require('fluent-json-schema')

const { responseObject } = require('../../config/schema')

/**
 * * Schema GET /otp
 */
const s_otpKeys = {
    response: {
        200: responseObject(S.array().items(S.string()))
    }
}
/**
 * * Schema POST /queue
 */
const s_queueAction = {
    body: S.object().prop(
        'action',
        S.enum(['drain', 'clean', 'obliterate']).required()
    ),
    response: {
        200: responseObject()
    }
}

module.exports = { s_otpKeys, s_queueAction }
