const { Types } = require('mongoose')
const {
    product,
    electronics,
    cloth,
    furniture,
} = require('../../models/product.model')

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProduct({ query, limit, skip })
}
const findAllPublishForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find(
        {
            isPublished: true,
            $text: {
                $search: regexSearch,
            },
        },
        {
            scope: {
                $meta: 'textScore',
            },
        }
    ).sort({
        scope: {
            $meta: 'textScore',
        },
    }).lean();
    return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: product_id,
    })
    if (!foundShop) {
        return null
    }
    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: product_id,
    })
    if (!foundShop) {
        return null
    }
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
    return await product
        .find({ ...query })
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
}
