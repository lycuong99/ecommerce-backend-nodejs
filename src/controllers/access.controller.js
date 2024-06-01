const { Created, Ok, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    async handleRefreshToken(req, res, next) {
        return new Ok({
            message: 'Refresh token successfully',
            metadata: await AccessService.handleRefreshToken({
                refreshToken:req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            })
        }).send(res)
    }
    async signUp(req, res, next) {
        console.log(`[P]::signUp::`, req.body)
        // res.status(201).json(await AccessService.signUp(req.body))

        new Created({
            message: 'Registered successfully',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }

    async login(req, res, next) {
        new Ok({
            message: 'Logged in successfully',
            metadata: await AccessService.login(req.body),
        }).send(res)
    }

    async logout(req, res, next) {
        new Ok({
            message: 'Logged out successfully',
            metadata: await AccessService.logout({keyStore:req.keyStore}),
        }).send(res)
    }
}

module.exports = new AccessController()
