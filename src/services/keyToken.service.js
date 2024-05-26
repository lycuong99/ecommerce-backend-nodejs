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
                },
                option = {
                    upsert: true,
                    new: true,
                }
            keytokenModel.findOneAndUpdate(filter, update, option);
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService
