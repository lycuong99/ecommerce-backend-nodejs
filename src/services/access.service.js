const shopModel = require('../models/shop.model')

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')

const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getIntoData } = require('../utils')
const { BadRequestError, AuthFailError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static handleRefreshToken = async ({
        refreshToken,
        user,
        keyStore
    }) => {
        const {userId, email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError('Something went wrong!! Please login again');
        }
        if(refreshToken != keyStore.refreshTokenCurrentUse) {
            throw new AuthFailError('User is not registered');
        }


        const tokens = createTokenPair(
            {
                userId,
                email,
            },
            keyStore.privateKey,
            keyStore.privateKey
        );

        await keyStore.updateOne({
            $set:{
                refreshTokenCurrentUse: tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed: refreshToken
            }
        });

        return {
            user,
            tokens
        }
            





    }
    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(`delKey::`, delKey);
        return delKey;
    }
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail(email);

        if (!foundShop) {
            throw new BadRequestError('Shop not found')
        }

        const isMatchPassword = bcrypt.compareSync(password, foundShop.password)
        if (!isMatchPassword) {
            throw new AuthFailError('Wrong password')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const userId = foundShop._id;
        const tokens = createTokenPair(
            {
                userId,
                email: foundShop.email,
            },
            publicKey,
            privateKey
        )

        //save tokens
        await KeyTokenService.createToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })

        return {
            shop: getIntoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens,
        }
    }
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
                publicKey = crypto.randomBytes(64).toString('hex')

            console.log({ privateKey, type: typeof privateKey, publicKey })

            const keyStore = await KeyTokenService.createToken({
                userId: newShop._id,
                publicKey,
                privateKey,
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
                        fields: ['_id', 'name', 'email'],
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
