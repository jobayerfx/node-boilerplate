const base = async function (request, reply) {
    let data = await this.cache.get('uniq:root')

    if (!data) {
        data = {
            API: 'Welcome to ArektaCoinStore',
            Redis: 'Waiting'
        }
        this.cache.set('uniq:root', {
            API: 'Welcome to ArektaCoinStore',
            Redis: 'Connected'
        })
    }

    reply.code(200)
    return {
        error: false,
        message: data
    }
}

const otpKeys = async function (request, reply) {
    const data = await this.cache.get_pattern('uniq:otp*')

    reply.code(200)
    return {
        error: false,
        message: data.length
            ? 'All OTP in circulation'
            : 'No OTP in ciruclation',
        data
    }
}

const redisData = async function (request, reply) {
    const key = request.body.key

    const data = await this.cache.get(key)

    reply.code(200)
    return {
        error: false,
        message: `Data for Redis ${key}`,
        data
    }
}

const flushRedis = async function (request, reply) {
    await this.cache.flush_pattern('acs*')

    reply.code(200)
    return {
        error: false,
        message: 'Redis globally flushed'
    }
}

const queueAction = async function (request, reply) {
    const action = request.body?.action

    switch (action) {
        case 'drain':
            await this.queue.drain()
            break

        case 'clean':
            await this.queue.clean(
                60000, // 1 minute
                1000, // max number of jobs to clean
                'paused'
            )
            break

        case 'obliterate':
            await this.queue.obliterate()
            break
    }

    reply.code(200)
    return {
        error: false,
        message: `BullMQ Action - ${action} performed successfully`
    }
}

module.exports = { base, otpKeys, redisData, flushRedis, queueAction }
