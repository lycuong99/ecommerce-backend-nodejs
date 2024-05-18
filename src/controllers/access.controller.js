const { Created } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    async signUp(req, res, next) {
        console.log(`[P]::signUp::`, req.body)
        // res.status(201).json(await AccessService.signUp(req.body))

        new Created({
            message: 'Registered successfully',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController()
