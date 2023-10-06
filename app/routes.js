const cache = require('../utility/cache')
const rootRoutes = require('./helper')
const authPublicRoutes = require('./auth/public')
const authAdminRoutes = require('./auth/admin')
const userAdminRoutes = require('./user/admin')
const userCustomerRoutes = require('./user/customer')

module.exports = async function (app) {
	app.decorate('cache', cache(app.redis))

	app.setNotFoundHandler(
		{
			preHandler: app.rateLimit({
				max: 3,
				timeWindow: 1000 * 60
			})
		},
		function (request, reply) {
			reply.code(404).send({ error: true, message: '404 - Route Not Found' })
		}
	)
	/**
	 * * entrypoint routes
	 */
	app.register(rootRoutes)
	/**
	 * * Service Routes Registration with Prefix
	 */
	app

		.register(authPublicRoutes, { prefix: '/v1/auth' })
		.register(authAdminRoutes, { prefix: '/v1/admin/auth' })
		.register(userAdminRoutes, { prefix: '/v1/user/admin' })
		.register(userCustomerRoutes, { prefix: '/v1/user/customer' })
}
