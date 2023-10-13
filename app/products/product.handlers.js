const {
    prouctList,
    productById,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProduct
} = require('./product.services')

/**
 * * Handler GET /v1/products/
 */
const showAll = async function (request, reply) {
    const data = await prouctList(this, request.query)

    reply.code(200)

    return {
        error: false,
        message: 'Products List Fetched!',
        data
    }
}
/**
 * * Handler GET /v1/product/:id
 */
const show = async function (request, reply) {
    const id = request.params.id

    const data = await productById(this, id)

    reply.code(200)

    return {
        error: false,
        message: `Product ID: ${id} Fetched!`,
        data
    }
}

/**
 * * Handler POST /v1/product/:id
 */
const create = async function (request, reply) {
    await createProduct(this, request.body)

    reply.code(201)

    return {
        error: false,
        message: 'Product created!'
    }
}

/**
 * * Handler PUT | PATCH /v1/user/customer/:id
 */
const update = async function (request, reply) {
    await updateProduct(this, request.params.id, request.body)

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
    await deleteProduct(this, id)

    reply.code(200)
    return {
        error: false,
        message: `Product id: ${id} deleted.`
    }
}

/**
 * * Handler GET /v1/user/customer/filter
 */
const filter = async function (request, reply) {
    const data = await filterProduct(this, request.query)

    reply.code(200)

    return {
        error: false,
        message: 'Filtered Product Fetched!',
        data
    }
}

module.exports = { showAll, show, create, update, destroy, filter }