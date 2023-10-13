const S = require('fluent-json-schema')

const {
    productPublicObj,
    responseObject,
    s_paginate
} = require('../../config/schema')

/**
 * * Schema GET /v1/user/product/
 */
const s_showAll = {
    query: S.object()
        .prop('current_page', S.number())
        .prop('per_page', S.number()),
    response: { 200: s_paginate(productPublicObj) }
}
/**
 * * Schema GET /v1/user/product/
 */
const filterParams = S.object()
    .prop('name', S.string())
    .prop('slug', S.string())
    .prop('current_page', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
    .prop('per_page', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))

const s_filter = {
    query: filterParams,
    response: { 200: s_paginate(productPublicObj) }
}
/**
 * * Schema GET /v1/user/product/:id
 */
const s_show = {
    params: S.object().prop('id', S.number().required()),
    response: { 200: responseObject(productPublicObj) }
}
/**
 * * Schema POST /v1//product/
 */
const createProductBody = S.object()
    .prop('name', S.string().minLength(6).maxLength(100))
    .prop('slug', S.string().minLength(6).maxLength(100))
    .prop('type', S.string())
    .prop('is_published', S.boolean())
    .prop('parent_id', S.number())
    .prop('is_key_reserved', S.boolean())

const s_create = {
    params: S.object().prop(),
    body: createProductBody,
    response: { 201: responseObject() }
}

/**
 * * Schema PUT | PATCH /v1/user/product/:id
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
 * * Schema DELETE /v1/user/product/:id
 */
const s_destroy = {
    params: S.object().prop('id', S.number().required()),
    response: { 201: responseObject() }
}

module.exports = {
    s_showAll,
    s_show,
    s_create,
    s_update,
    s_destroy,
    s_filter
}
