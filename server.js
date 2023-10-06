require('dotenv').config()

const Fastify = require('fastify')
const closeWithGrace = require('close-with-grace')

const dev = process.env.NODE_ENV === 'development'

/**
 * * give array of ip for trustproxy in production
 */
const app = Fastify({
    trustProxy: true,
    logger: {
        transport: dev
            ? {
                  target: 'pino-pretty',
                  options: {
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid,hostname'
                  }
              }
            : undefined
    }
})

const conf = require('./config/environment')
// * Plugins
app.register(require('@fastify/helmet'), { global: true })
    .register(require('@fastify/cors'), conf.cors)
    .register(require('@fastify/formbody'))
    .register(require('@fastify/sensible'))
    .register(require('@fastify/redis'), conf.redis)
    .register(require('@fastify/rate-limit'), conf.rate_limit)
    .register(require('./plugins/jwt'))
    .register(require('./plugins/bullMQ'))
/**
 * * Database
 */
const knex = require('./plugins/knex')
if (dev) {
    app.log.info('db: development')
    const { development } = require('./knexfile')
    app.register(knex, development)
} else {
    app.log.info('db: production')
    app.register(knex, conf.sql)
}

/**
 * * Register the app directory
 */
app.register(require('./app/routes'))

/**
 * * delay is the number of milliseconds for the graceful close to finish
 */
const closeListeners = closeWithGrace(
    { delay: 2000 },
    async function ({ err }) {
        app.log.info('graceful shutdown -> entered')
        if (err) {
            app.log.error(err)
        }
        await app.close()
    }
)

app.addHook('onClose', async (instance, done) => {
    closeListeners.uninstall()
    app.log.info('graceful shutdown -> sucessful')
    done()
})

// * Run the server!
const serve = async () => {
    try {
        await app.listen({
            port: process.env.PORT || 3000,
            host: process.env.HOST || '0.0.0.0'
        })
    } catch (err) {
        app.log.error(err)
    }
}

serve()
