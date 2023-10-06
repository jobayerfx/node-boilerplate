const {
    userList,
    userById,
    updateUser,
    deleteUser,
    filterUser
} = require('./customer.services')

/**
 * * Handler GET /v1/user/customer/
 */
const showAll = async function (request, reply) {
    const data = await userList(this, request.query)

    reply.code(200)

    return {
        error: false,
        message: 'Customer List Fetched!',
        data
    }
}
/**
 * * Handler GET /v1/user/customer/:id
 */
const show = async function (request, reply) {
    const id = request.params.id

    const data = await userById(this, id)

    reply.code(200)

    return {
        error: false,
        message: `Customer ID: ${id} Fetched!`,
        data
    }
}

/**
 * * Handler PUT | PATCH /v1/user/customer/:id
 */
const update = async function (request, reply) {
    await updateUser(this, request.params.id, request.body)

    reply.code(201)

    return {
        error: false,
        message: 'Customer User Updated'
    }
}

/**
 * * Handler DELETE /v1/user/customer/:id
 */
const destroy = async function (request, reply) {
    const id = request.params.id
    await deleteUser(this, id)

    reply.code(200)
    return {
        error: false,
        message: `Customer User: ${id} deleted.`
    }
}

/**
 * * Handler GET /v1/user/customer/filter
 */
const filter = async function (request, reply) {
    const data = await filterUser(this, request.query)

    reply.code(200)

    return {
        error: false,
        message: 'Filtered UserList Fetched!',
        data
    }
}

module.exports = { showAll, show, update, destroy, filter }
