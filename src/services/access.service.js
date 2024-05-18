const shopModel = require('../models/shop.model')

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')

const { createTokenPair } = require('../auth/authUtils')
const { getIntoData } = require('../utils')
const { BadRequestError } = require('../core/error.response')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static async signUpLevel3({ name, email, password }) {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already exists',
                }
            }
            const COMPLEX_LEVEL = 10
            const passwordHash = await bcrypt.hash(password, COMPLEX_LEVEL)

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            })

            if (newShop) {
                // create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    'rsa',
                    {
                        modulusLength: 4096,
                        publicKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem',
                        },
                        privateKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem',
                        },
                    }
                )
                

                console.log({ privateKey, type: typeof privateKey, publicKey })

                const publicKeyString = await KeyTokenService.createToken({
                    userId: newShop._id,
                    publicKey,
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'Failed to create publicKey',
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                console.log(`publicKeyObject::`, publicKeyObject)

                const tokens = createTokenPair(
                    {
                        userId: newShop._id,
                        email: email,
                    },
                    publicKeyObject,
                    privateKey
                )
                console.log(`Created Token success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData({
                            fields: [_id, name, email],
                            object: newShop,
                        }),
                        tokens,
                    },
                }
            }

            return {
                code: 200,
                metadata: null,
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    }

    static async signUp({ name, email, password }) {
        
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop) {
                throw new BadRequestError('Shop already exists')
            }
            const COMPLEX_LEVEL = 10
            const passwordHash = await bcrypt.hash(password, COMPLEX_LEVEL)

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            })

            if (newShop) {
                // create privateKey, publicKey
                //For LARGE SYSTEM
                // const { privateKey, publicKey } = crypto.generateKeyPairSync(
                //     'rsa',
                //     {
                //         modulusLength: 4096,
                //         publicKeyEncoding: {
                //             type: 'pkcs1',
                //             format: 'pem',
                //         },
                //         privateKeyEncoding: {
                //             type: 'pkcs1',
                //             format: 'pem',
                //         },
                //     }
                // )

                const privateKey = crypto.randomBytes(64).toString('hex'),
                publicKey = crypto.randomBytes(64).toString('hex');



                console.log({ privateKey, type: typeof privateKey, publicKey })

                const keyStore = await KeyTokenService.createToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    throw new BadRequestError('Failed to create keyStore')
                }

              

                const tokens = createTokenPair(
                    {
                        userId: newShop._id,
                        email: email,
                    },
                    publicKey,
                    privateKey
                )
                console.log(`Created Token success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens,
                    },
                }
            }

            return {
                code: 200,
                metadata: null,
            }
       
    }
}

module.exports = AccessService
