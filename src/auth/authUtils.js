const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandle')
const { AuthFailError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    APIKEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-refresh-token',
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

    if(req.headers[HEADER.REFRESH_TOKEN]){
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) {
                throw new AuthFailError('Invalid Request!')
            }
            req.keyStore = keyStore;
            req.refreshToken = refreshToken;
            req.user = decodeUser
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailError('Invalid Request!')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailError('Invalid Request!')
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)

}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}
