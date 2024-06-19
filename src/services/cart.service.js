/*
    - add product to cart
    - reduce product quantity by one
    - remove product from cart
    - get cart
    - delete cart
 */

const { NotFoundError, BadRequestError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { findProduct } = require('../models/repositories/product.repo')
const { toObjectIdMongo } = require('../utils')

class CartService {
    static async createUserCart({ userId, product }) {
        return await cart.findOneAndUpdate(
            {
                cart_userId: userId,
                cart_state: 'active',
            },
            {
                $addToSet: {
                    cart_products: product,
                },
            },
            {
                new: true,
                upsert: true,
            }
        )
    }

    static async updateCartProductQuantity({ userId, product }) {
        const { quantity, productId } = product
        return await cart.findOneAndUpdate(
            {
                cart_userId: userId,
                cart_state: 'active',
                'cart_products.productId': productId,
            },
            {
                $inc: {
                    'cart_products.$.quantity': quantity,
                },
            },
            {
                new: true,
                upsert: true,
            }
        )
    }
    /**
     *
     * @param {*} userId
     * @param {*} product
     * @returns
     */
    static async addProductToCart({ userId, product = {} }) {
        const foundCart = await cart.findOne({
            cart_userId: userId,
        });

        const foundProduct = await findProduct({
            product_id: toObjectIdMongo(product.productId),
        });

        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }

        product.price = foundProduct.price;
        product.name = foundProduct.name;


        if (!foundCart) {
            return await this.createUserCart({ userId, product })
        }

        //chua co bat ky san pham nao trong cart
        if (!foundCart.cart_products.length) {
            foundCart.cart_products = [product]
            return await foundCart.save()
        }

        //?? san pham chua co trong cart
        const foundProductInCart = foundCart.cart_products.find(
            (item) => item.productId === product.productId
        )

        if (!foundProductInCart) {
            foundCart.cart_products.push(product)
            return await foundCart.save()
        }
        // co san pham -> update quantity
        return await this.updateCartProductQuantity({ userId, product })
    }

    //update cart
    /*
        shop_order_ids = [
            {
                shopId,
                products: [
                    {
                        quantity,
                        price,
                        shopId,
                        oldQuantity,
                        productId
                    }
                ]
            }
        ]
    */
    /**
     * @description when user update quantity of product in cart
     * @param {*} param0
     * @returns
     */
    static async addProductToCartv2({ userId, shop_order_ids }) {
        const { productId, quantity, oldQuantity, shopId } = shop_order_ids[0]?.products[0];

        //check product
        // const foundProduct = await findProduct({ product_id: toObjectIdMongo(productId) });

        const foundProduct = await findProduct({
            product_id: toObjectIdMongo(productId),
        });
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }

        if (foundProduct.product_shop.toString() !== shopId) {
            throw new BadRequestError('Product is not in this shop')
        }

        if(quantity === 0){
            this.removeProductFromCart({ userId, productId });
        }

        return await this.updateCartProductQuantity({
            userId,
            product: {
                quantity: quantity - oldQuantity,
                productId,
            },
        });
    }

    static async removeProductFromCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active',
        }

        return await cart.updateOne(query, {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        })
    }

    static async getCart({ userId }) {
        return await cart
            .findOne({
                cart_userId: userId,
            })
            .lean()
    }
}

module.exports = CartService
