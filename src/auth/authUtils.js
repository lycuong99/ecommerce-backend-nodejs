const JWT = require('jsonwebtoken');
const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        //verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify::`, err);
            }
            else {
                console.log(`decode verify::`, decode);
            }
        });

        return {
            accessToken,
            refreshToken
        }


    } catch (error) {
        console.log(`error::`, error);
    }
}

module.exports = {
    createTokenPair
}