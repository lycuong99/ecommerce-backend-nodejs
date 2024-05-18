const { findApiKey } = require("../services/apikey.service");

const HEADER = {
    APIKEY : "x-api-key",
    AUTHORIZATION : "authorization"
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.APIKEY];
        if (!key) {
            return res.status(403).json({
                message: "Api key is missing"
            })
        }
    
        const keyObject = await findApiKey(key);
        console.log('aa',key,keyObject);
        if(!keyObject){
            return res.status(403).json({
                message: "Invali or expired api key"
            })
        }

        req.apiKeyObject = keyObject;
        return next();
    } catch (error) {
        return next(error)
    }
}

const permission = (permission) => async (req, res, next) => {
    if(!req.apiKeyObject.permissions){
        return res.status(403).json({
            message: "Permission denied!"
        })
    }
    console.log(`Permission:: ${permission}`);
   if(!req.apiKeyObject.permissions.includes(permission)){
    return res.status(403).json({
        message: "Permission denied!"
    })
   }

   next();
}

const asyncHandler = fn => {
    return async (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
module.exports = {
    apiKey,
    permission,
    asyncHandler
}