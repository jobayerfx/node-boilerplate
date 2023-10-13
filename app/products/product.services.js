/**
 * * get all users
 */
const prouctList = async (app, props) => {
    const { per_page, current_page } = props || {}

    return await app.paginate_data({
        table: 'products',
        per_page,
        current_page
    })
}
/**
 * * filter users
 */
const filterProduct = async (app, props) => {
    const { name, type, per_page, current_page } =
        props || {}

    const q_filter = app.knex('products').where(builder => {
        if (name) builder.where('name', name)
        if (type) builder.where('type', type)
    })

    return await app.paginate_data({
        table: 'products',
        query: q_filter,
        per_page,
        current_page
    })
}
/**
 * * get product by id
 */
const productById = async (app, id) => {
    const product = await app.knex('products').where('id', id).first()

    if (!product) throw app.httpErrors.notFound(`Product with ID: ${id} not found!`)

    return product
}
/**
 * * update user email or password
 */
const createProduct = async (app, props) => {
    const { name, slug, type, is_published, parent_id, is_key_reserved } = props || {}

    return await app
        .knex('products')
        .insert({ name, slug, type, is_published, parent_id, is_key_reserved })
}
/**
 * * update user email or password
 */
const updateProduct = async (app, id, props) => {
    await userById(app, id)

    let { email, email_verified, password, is_banned } = props || {}

    if (password) {
        password = await app.bcrypt.hash(password)
    }

    return await app
        .knex('products')
        .where('id', id)
        .update({ email, email_verified, password, is_banned })
}
/**
 * * delete a user by id
 */
const deleteProduct = async (app, id) => {
    const isDeleted = await app.knex('products').where('id', id).del()

    if (!isDeleted)
        throw app.httpErrors.notFound(`Product with ID: ${id} not found!`)

    return isDeleted
}

module.exports = { prouctList, productById, createProduct, updateProduct, deleteProduct, filterProduct }
