const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");
async function findApiKey(key) {
    // const newApiKey = crypto.randomBytes(64).toString('hex');
    // apikeyModel.create({
    //     key: newApiKey,
    //   permissions: ['0000'],
    //   status: true
    // });

    const foundApiKey = await apikeyModel.findOne({key, status: true}).lean();
     return foundApiKey;
 }

 module.exports = {
   findApiKey
 }