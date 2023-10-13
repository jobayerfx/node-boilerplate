const bcrypt = require('../../plugins/bcrypt')

const {
    showAll,
    show,
    create,
    update,
    destroy,
    filter
} = require('./product.handlers')
const {
    s_showAll,
    s_show,
    s_create,
    s_update,
    s_destroy,
    s_filter
} = require('./product.schema')

module.exports = async function (fastify) {
    fastify.register(bcrypt)

    fastify.route({
        method: 'GET',
        url: '/',
        onRequest: fastify.role.restricted,
        schema: s_showAll,
        handler: showAll
    })

    fastify.route({
        method: 'GET',
        url: '/filter',
        onRequest: fastify.role.restricted,
        schema: s_filter,
        handler: filter
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        onRequest: fastify.role.restricted,
        schema: s_show,
        handler: show
    })
    fastify.route({
        method: 'POST',
        url: '/',
        onRequest: fastify.role.restricted,
        schema: s_create,
        handler: create
    })

    fastify.route({
        method: 'PATCH',
        url: '/:id',
        onRequest: fastify.role.restricted,
        schema: s_update,
        handler: update
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        onRequest: fastify.role.admin,
        schema: s_destroy,
        handler: destroy
    })
}
