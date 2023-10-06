const { createTransport } = require('nodemailer')

module.exports = function (job) {
    try {
        const { action, payload } = job.data || null

        const {
            mailer: { defaults, transport }
        } = require('../../config/environment')

        let transporter
        if (defaults) {
            transporter = createTransport(transport, defaults)
        } else {
            transporter = createTransport(transport)
        }

        const t_otp = require('./templates/otp')

        switch (action) {
            case 'otp':
                transporter.sendMail({
                    to: payload.email,
                    subject: 'OTP Code for ArektaCoinStore',
                    text: `OTP code is: ${payload.otp_code}`,
                    html: t_otp(payload.otp_code)
                })
                return `OTP Mail Sent for ${payload.email}`
        }
    } catch (e) {
        throw Error(e.message)
    }
}
