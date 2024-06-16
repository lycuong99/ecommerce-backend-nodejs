const { getUnSelectData, toObjectIdMongo } = require('../../utils')
const { discount } = require('../discount.model')

async function findAllDiscountByShopIdUnselect({
    filter,
    unSelect,
    sort = 'ctime',
    page = 1,
    limit = 50,
}) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await discount
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getUnSelectData(unSelect))
        .lean()
}
async function findDiscount({ code, shopId }) {
    const foundDiscount = await discount
        .findOne({
            discount_code: code,
            discount_shopId: toObjectIdMongo(shopId),
        })
        .lean()
    return foundDiscount
}

module.exports = {
    findAllDiscountByShopIdUnselect,
    findDiscount
}
