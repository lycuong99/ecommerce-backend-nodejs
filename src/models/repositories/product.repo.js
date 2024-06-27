const { Types } = require('mongoose')
const {
    product,
    electronics,
    clothing: cloth,
    furniture,
} = require('../../models/product.model')
const { getSelectData, getUnSelectData } = require('../../utils')

const findAllForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProduct({ query, limit, skip })
}
const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProduct({ query, limit, skip })
}
const findAllPublishForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product
        .find(
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
        )
        .sort({
            scope: {
                $meta: 'textScore',
            },
        })
        .lean()
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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
}

const findProduct = async ({product_id, unSelect = []}) =>{
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const updateProductById = async ({product_id, payload, isNew=true, model })=>{
   return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
}

const checkProductsByServer = async (products=[]) => {
   return Promise.all([
    products.map( async (product) => {
        const foundProduct = await findProduct({ product_id: product.productId });
        if (foundProduct) {
            return {
                ...product,
                price: foundProduct.price,
            }
        }
    })
   ])
}

module.exports = {
    findAllForShop,
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProduct: updateProductById,
    checkProductsByServer
}
