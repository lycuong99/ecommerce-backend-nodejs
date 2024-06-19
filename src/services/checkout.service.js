const { NotFoundError } = require('../core/error.response')
const { findCartById } = require('../models/repositories/cart.repo')
const {
    findProduct,
    checkProductsByServer,
} = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')

class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shopDiscount: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    products:[
                        {
                            price,
                            quantity,
                            productId,

                        }
                    ]
                }
            ]
        }
    */
    static async reviewCheckoutOrder({ userId, shop_order_ids = [], cartId }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) {
            throw new NotFoundError('Cart not found')
        }
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckOut: 0,
        }

        const shop_order_ids_new = []

        shop_order_ids.map(async (shop_order_id) => {
            const { shopId, shopDiscounts, products } = shop_order_id

            const checkProductServer = await checkProductsByServer(products)

            let hasSomeProductError = checkProductServer.some((item) => !item)
            if (hasSomeProductError) {
                throw new BadRequestError('Order wrong')
            }

            const checkOutPrice = checkProductServer.reduce(
                (acc, { price, quantity }) => acc + price * quantity,
                0
            )

            checkout_order.totalPrice += checkOutPrice

            const itemCheckout = {
                shopId,
                shopDiscounts,
                products: checkProductServer,
                priceRaw: checkOutPrice,
                priceApplyDiscount: checkOutPrice,
            }

            if (shopDiscounts.length > 0) {

                //gia suc chi co 1 ma discount
                const {totalOrder, totalPrice, discount} = await getDiscountAmount({
                    code: shopDiscounts[0].code,
                    shopId,
                    userId,
                    products: checkProductServer,
                });

                checkout_order.totalDiscount += discount;

                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkOutPrice - discount;  
                }
            }
        });

        checkout_order.totalCheckOut = checkout_order.totalPrice - checkout_order.totalDiscount;
    }
}

module.exports = {
    CheckoutService,
}
