/**
 * * Fetch User by Email
 */
const fetchUser = async (app, id) => {
    const user = await app.knex('user_customers').where('id', id).first()

    if (!user) throw app.httpErrors.notFound('User not found!')

    return user
}
/**
 * * Fetch User Purchase History
 */
const fetchUserPurchases = async (app, id) => {
    const order_history = await app.knex('orders').where('user_id', id)

    if (order_history.length > 0) {
        const promises = order_history.map(async el => {
            if (el.status === 'delivered') {
                el.order_items = await app
                    .knex('order_items')
                    .where('order_items.order_id', el.id)
                    .join(
                        'product_keys',
                        'product_keys.order_items_id',
                        '=',
                        'order_items.id'
                    )
                    .join(
                        'products',
                        'product_keys.product_id',
                        '=',
                        'products.id'
                    )
                    .select(
                        'order_items.id as item_id',
                        'order_items.form as item_form',
                        'products.slug as product_slug',
                        'products.name as product_name',
                        'products.photo as product_photo',
                        'product_keys.code as license_key',
                        'product_keys.status as license_status'
                    )
            }
        })
        await Promise.all(promises)
    }

    return order_history
}
/**
 * * Authenticate passed user
 */
const authenticate = async (app, props) => {
    const { email, password } = props || {}
    const key = `uniq:timeout:${email}`
    let count = await app.cache.get(key)
    if (count >= 5) {
        throw app.httpErrors.forbidden(
            '5 Wrong Attempts! Try again in 5 minutes.'
        )
    }

    const user = await app.knex('user_customers').where('email', email).first()

    if (!user) throw app.httpErrors.notFound(`User: ${email}, not found!`)

    const match = await app.bcrypt.compare(password, user.password)

    if (!match) {
        count++
        await app.redis.setex(key, 300, count.toString())
        throw app.httpErrors.forbidden('Password Incorrect!')
    }

    return await app.auth.token(user)
}
/**
 * * Create User via Registration
 */
const registration = async (app, props) => {
    let { email, password } = props || {}

    let user = await app.knex('user_customers').where('email', email).first()

    if (user)
        throw app.httpErrors.badRequest(
            `User: ${email} already exists! Please Login`
        )

    password = await app.bcrypt.hash(password)

    const userID = await app.knex('user_customers').insert({ email, password })

    user = {
        id: userID[0],
        email,
        email_verified: false,
        is_banned: false
    }
    return await app.auth.token(user)
}

const verifyUserEmail = async (app, email) => {
    const isUpdated = await app
        .knex('user_customers')
        .where('email', email)
        .update({ email_verified: true })

    if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)

    const user = await app.knex('user_customers').where('email', email).first()
    return await app.auth.token({ ...user, role: 'customer' })
}

const updateUserPassword = async (app, props) => {
    const { email, password } = props || {}

    const hashedPassword = await app.bcrypt.hash(password)

    const isUpdated = await app
        .knex('user_customers')
        .where('email', email)
        .update({ password: hashedPassword })

    if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)
}

/**
 * * Generate OTP Code
 */
const getOTP = async (app, email) => {
    const user = await app.knex('user_customers').where('email', email).first()

    if (!user) throw app.httpErrors.notFound('User not found!')

    const otp_code = Math.random().toString().substring(2, 8)

    //* 30 minute expiry
    await app.redis.setex(`uniq:otp:${email}`, 1800, otp_code)

    app.log.info({ otp_code }, 'otp here: ')

    app.queue.add(`${'otp'}-${email}`, {
        action: 'otp',
        payload: {
            email,
            otp_code
        }
    })

    return otp_code
}
/**
 * * Verify OTP Code
 */
const verifyOTP = async (app, props) => {
    const key = `uniq:otp:${props.email}`

    const otp = await app.redis.get(key)

    // eslint-disable-next-line eqeqeq
    if (otp && otp == props.code) {
        await app.redis.del(key)
        return true
    } else {
        return false
    }
}

module.exports = {
    registration,
    authenticate,
    fetchUser,
    getOTP,
    verifyOTP,
    verifyUserEmail,
    updateUserPassword,
    fetchUserPurchases
}
