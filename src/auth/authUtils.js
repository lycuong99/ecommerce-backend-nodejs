const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandle')
const { AuthFailError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    APIKEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}

const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days',
        })

        //verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })

        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        console.log(`error::`, error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailError('Invalid Request!')
    }

    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError('Not Found keyStore!')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailError('Invalid Request!')
    }

    try {
        const decodeUsers = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUsers.userId) {
            throw new AuthFailError('Invalid Request!')
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}
