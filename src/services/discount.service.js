const { BadRequestError, NotFoundError } = require('../core/error.response')
const { discount } = require('../models/discount.model')
const {
    findAllDiscountByShopIdUnselect,
    findDiscount,
} = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const {
    toObjectIdMongo,
    removeNullAttributes,
    updateNestedObjectParse,
} = require('../utils')

/* 
    1. generate discount code [Admin | Shop]
    2. get discount amount [User]
    3. get all discount code [User | Shop]
    4. verify discount code [User]
    5. delete discount code [Admin | Shop]
    6. cancel discount code [User]
*/
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            name,
            code,
            type,
            value,
            max_value,
            description,
            start_date,
            end_date,
            max_usage,
            max_usage_per_user,
            is_active,
            shopId,
            min_order_value,
            applies_to,
            product_ids,
            usage_count,
        } = payload

        //validate
        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('start_date must be less than end_date')
        }
        if (new Date(start_date) < new Date()) {
            throw new BadRequestError(
                'start_date must be greater than current date'
            )
        }

        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: toObjectIdMongo(shopId),
            })
            .lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        return await discount.create({
            discount_name: name,
            discount_code: code,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_description: description,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_usage: max_usage,
            discount_max_usage_per_user: max_usage_per_user,
            discount_is_active: is_active,
            discount_shopId: toObjectIdMongo(shopId),
            discount_min_order_value: min_order_value || 0,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_usage_count: usage_count,
            discount_users_used: [],
        })
    }

    static async updateDiscount(discount_id, payload) {
        const objParams = removeNullAttributes(payload)
        return await discount.findByIdAndUpdate(
            discount_id,
            updateNestedObjectParse(objParams),
            { new: true }
        )
    }

    static async getAllProductsWithDiscount({
        code,
        shopId,
        limit = 50,
        page = 1,
    }) {
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: toObjectIdMongo(shopId),
            })
            .lean()

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        console.log(`discount_product_ids: ${discount_product_ids}`);

        if (discount_applies_to === 'all') {
            return await findAllProducts({
                filter: {
                    product_shop: toObjectIdMongo(shopId),
                    isPublished: true,
                },
                select: ['name', 'price'],
                sort: 'ctime',
                limit,
                page,
            })
        }

        return await findAllProducts({
            filter: {
                product_shop: toObjectIdMongo(shopId),
                _id: {
                    $in: discount_product_ids,
                },
                isPublished: true,
            },
            select: ['name', 'price'],
            sort: 'ctime',
            limit,
            page,
        })
    }
    static async getAllDiscountCodeByProduct({
        product_id,
        shopId,
        limit = 50,
        page = 1,
    }) {
        const foundProducts = await findAllDiscountByShopIdUnselect({
            filter: {
                discount_shopId: toObjectIdMongo(shopId),
                discount_is_active: true,
                $or: [
                    { discount_applies_to: 'all' },
                    {
                        discount_applies_to: 'specific',
                        discount_product_ids: toObjectIdMongo(product_id)
                    }
                ]
            },
            unSelect: ['__v', 'discount_shopId'],
            limit,
            page,
        });

        return foundProducts;

      

    }
    static async getAllDiscountByShopId({
        shopId,
        limit = 50,
        page = 1,
    }) {
        return await findAllDiscountByShopIdUnselect({
            filter: {
                discount_shopId: toObjectIdMongo(shopId),
                discount_is_active: true,
            },
            limit,
            page,
            unSelect: ['__v', 'discount_shopId'],
        })
    }

    static async getDiscountAmount({ code, shopId, userId, products = [] }) {

        const foundDiscount = await findDiscount({ code, shopId })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        const {
            discount_applies_to,
            discount_value,
            discount_type,
            discount_max_value,
            discount_min_order_value,
            discount_is_active,
            discount_max_usage,
            discount_end_date,
            discount_start_date,
            discount_max_usage_per_user,
            discount_users_used,
        } = foundDiscount

        if (!discount_is_active) {
            throw new BadRequestError('Discount code is expired')
        }

        if (!discount_max_usage) {
            throw new BadRequestError('Discount code is out of usage')
        }

        if (
            new Date() > new Date(discount_end_date) ||
            new Date() < new Date(discount_start_date)
        ) {
            throw new BadRequestError('Discount code is expired')
        }

        const totalOrder = products.reduce(
            (acc, { price, quantity }) => acc + price * quantity,
            0
        )

        if (discount_min_order_value > 0) {
            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(
                    'Discount code is required minimum order value is' +
                        discount_min_order_value
                )
            }
        }

        if (discount_max_usage_per_user > 0) {
            const user = discount_users_used.find(
                (user) => user.userId === userId
            )
            if (user) {
                if (user.count >= discount_max_usage_per_user) {
                    throw new BadRequestError(
                        'Discount code is out of usage per user'
                    )
                }
            }
        }

        const amount =
            discount_type === 'fixed_amount'
                ? discount_value
                : (totalOrder * discount_value) / 100

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ shopId, code }) {
        return await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: toObjectIdMongo(shopId),
        })
    }

    static async cancelDiscountCode({ shopId, code }) {
        const foundDiscount = findDiscount({ code, shopId })
        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        return await discount.findOneAndUpdate(
            {
                discount_code: code,
                discount_shopId: toObjectIdMongo(shopId),
            },
            {
                $pull: {
                    discount_users_used: userId,
                },
                $inc: {
                    discount_usage_count: -1,
                    discount_max_usage: 1,
                },
            }
        )
    }
}

module.exports = DiscountService