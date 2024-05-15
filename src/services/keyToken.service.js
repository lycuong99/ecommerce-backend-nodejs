const keytokenModel = require("../models/keytoken.model");

class KeyTokenService{
    static async createTokenLevel3({userId, publicKey}){
        try {
            const publicKeyString = publicKey.toString();
            console.log(`publicKeyString::`, publicKeyString===publicKey);

            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            });

            return tokens ? publicKeyString : null;
        } catch (error) {
            return error;
        }
    }

    static async createToken({userId, publicKey, privateKey}){
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return tokens ? publicKey : null;
        } catch (error) {
            return error;
        }
    } 
}

module.exports = KeyTokenService