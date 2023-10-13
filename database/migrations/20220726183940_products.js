/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
	await knex.schema.createTable('products', table => {
		table.increments('id')
		table.string('name', 255).notNullable()
		table.string('slug', 191).notNullable()
		table.string('type', 191).notNullable()
		table.boolean('is_published')
		table.integer('parent_id', 11).notNullable()
		table.boolean('is_key_reserved', 191).defaultTo(false)
		table.timestamps(true, true)
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
	await knex.schema.dropTableIfExists('products')
}
