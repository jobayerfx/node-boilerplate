const S = require('fluent-json-schema')

const {
    userObject,
    responseObject,
    s_paginate
} = require('../../../config/schema')

/**
 * * Schema GET /v1/user/customer/
 */
const s_showAll = {
    query: S.object()
        .prop('current_page', S.number())
        .prop('per_page', S.number()),
    response: { 200: s_paginate(userObject) }
}
/**
 * * Schema GET /v1/user/customer/
 */
const filterParams = S.object()
    .prop('email', S.string().format('email'))
    .prop('email_verified', S.mixed([S.TYPES.BOOLEAN, S.TYPES.NULL]))
    .prop('is_banned', S.mixed([S.TYPES.BOOLEAN, S.TYPES.NULL]))
    .prop('current_page', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
    .prop('per_page', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))

const s_filter = {
    query: filterParams,
    response: { 200: s_paginate(userObject) }
}
/**
 * * Schema GET /v1/user/customer/:id
 */
const s_show = {
    params: S.object().prop('id', S.number().required()),
    response: { 200: responseObject(userObject) }
}

/**
 * * Schema PUT | PATCH /v1/user/customer/:id
 */
const updateUserBody = S.object()
    .prop('email', S.string().minLength(6).maxLength(100).format('email'))
    .prop('password', S.string())
    .prop('email_verified', S.boolean())
    .prop('is_banned', S.boolean())

const s_update = {
    params: S.object().prop('id', S.number().required()),
    body: updateUserBody,
    response: { 201: responseObject() }
}
/**
 * * Schema DELETE /v1/user/customer/:id
 */
const s_destroy = {
    params: S.object().prop('id', S.number().required()),
    response: { 201: responseObject() }
}

module.exports = {
    s_showAll,
    s_show,
    s_update,
    s_destroy,
    s_filter
}
