const IORedis = require('ioredis')

module.exports = {
    cors: {
        origin: /https?:\/\/[^/]*\.example\.com(:\d{1,5})?/,
        method: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Access-Control-Allow-Origin',
            'Origin',
            'User-Agent',
            'X-Requested-With',
            'If-Modified-Since',
            'Cache-Control',
            'Range'
        ],
        credentials: true
    },
    sql: {
        client: 'mysql2',
        acquireConnectionTimeout: 10000,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        },
        asyncStackTraces: false,
        debug: false
    },
    redis: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        maxRetriesPerRequest: null
    },
    rate_limit: {
        redis: new IORedis({
            host: process.env.REDIS_URL,
            port: process.env.REDIS_PORT,
            connectTimeout: 500,
            maxRetriesPerRequest: 1
        }),
        max: 15,
        timeWindow: 1000 * 60,
        nameSpace: 'acs:limit:',
        keyGenerator: request => {
            const unique =
                request.headers['x-real-ip'] ||
                request.headers['x-forwarded-for'] ||
                request.raw.ip
            return `${unique}:${request.routerPath}`
        },
        allowList: function (request, key) {
            return request.headers['x-app-client-id'] === 'dev-team'
        }
    },
    mailer: {
        defaults: {
            from:
                process.env.MAILER_DEFAULT_FROM ,
            subject: 'No-Reply'
        },
        transport: {
            service: 'gmail',
            auth: {
                user:
                    process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        }
    },
    bullMQ: {
        queue: process.env.QUEUE_NAME || 'mail-queue',
        max: parseInt(process.env.QUEUE_GLOBAL_CONCURRENCY) || 60,
        duration: parseInt(process.env.QUEUE_LIMIT_DURATION) || 1000,
        concurrency: parseInt(process.env.QUEUE_CONCURRENCY) || 10
    }
}
