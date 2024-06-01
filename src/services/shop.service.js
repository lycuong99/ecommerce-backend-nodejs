const shopModel = require('../models/shop.model')

const findByEmail = async (
    email,
    select = {
        name:1,
        roles:1,
        _id:1,
        password: 1,
        email: 1,
    }
) => {
    const shop = await shopModel.findOne({ email }).select(select).lean();
    return shop;
}

module.exports = {
    findByEmail,
}
