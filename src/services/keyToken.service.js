const { Types } = require('mongoose')
const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static async createTokenLevel3({ userId, publicKey }) {
        try {
            const publicKeyString = publicKey.toString()
            console.log(`publicKeyString::`, publicKeyString === publicKey)

            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })

            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }

    static async createToken({ userId, publicKey, privateKey, refreshToken }) {
        try {
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // });

            // return tokens ? publicKey : null;
            const filter = {
                    user: userId,
                },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshTokenCurrentUse: refreshToken,
                },
                option = {
                    upsert: true,
                    new: true,
                }
            return await keytokenModel.findOneAndUpdate(filter, update, option)
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }

    static findByRefreshTokenCurrentUse = async (refreshToken) => {
        return await keytokenModel.findOne({
            refreshTokenCurrentUse: refreshToken,
        })
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken })
    }

    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }
}

module.exports = KeyTokenService
