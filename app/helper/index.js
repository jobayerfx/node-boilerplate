const {
    base,
    otpKeys,
    redisData,
    flushRedis,
    queueAction
} = require('./handlers')
const { s_otpKeys, s_queueAction } = require('./schema')

module.exports = async function (fastify) {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: base
    })

    fastify.route({
        method: 'POST',
        url: '/otp',
        onRequest: fastify.role.restricted,
        schema: s_otpKeys,
        handler: otpKeys
    })

    fastify.route({
        method: 'POST',
        url: '/redis',
        onRequest: fastify.role.restricted,
        handler: redisData
    })

    fastify.route({
        method: 'POST',
        url: '/queue',
        onRequest: fastify.role.restricted,
        schema: s_queueAction,
        handler: queueAction
    })

    fastify.route({
        method: 'POST',
        url: '/flush',
        onRequest: fastify.role.restricted,
        handler: flushRedis
    })
}
