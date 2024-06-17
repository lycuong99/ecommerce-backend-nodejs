/*
    - add product to cart
    - reduce product quantity by one
    - remove product from cart
    - get cart
    - delete cart
 */

const { cart } = require('../models/cart.model')
const { findProduct } = require('../models/repositories/product.repo')

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
    static async addProductToCart({ userId, product = {} }) {
        const foundCart = await cart.findOne({
            cart_userId: userId,
        })

        if (!foundCart) {
            return await this.createUserCart({ userId, product })
        }

        //chua co bat ky san pham
        if (!foundCart.cart_products.length) {
            foundCart.cart_products = [product]
            return await foundCart.save()
        }

        //?? san pham chua co
        const foundProduct = foundCart.cart_products.find(
            (item) => item.productId === product.productId
        );
        if (!foundProduct) {
            foundCart.cart_products.push(product)
            return await foundCart.save()
        }
        // co san pham -> update quantity
        return await this.updateCartProductQuantity({ userId, product });
    }

    /*
        shop_order_ids = [
            {
                shopId,
                products
            }
        ]
    */
    static async addProductToCartv2({shop_order_ids = [], userId, products}){
        const foundCart = await cart.findOne({
            cart_userId: userId,
        });

        if (!foundCart) {
            return await this.createUserCart({ userId, product })
        }

        if(shop_order_ids && shop_order_ids.length > 0){
            shop_order_ids.forEach(async (shop_order_id) => {
                const { shopId, productId } = shop_order_id.products[0];
                const checkProduct = await findProduct({product_id: productId});
                if(!checkProduct){
                    throw new NotFoundError('Product not found');
                }
                if(checkProduct.product_shop.toString()!== shopId){
                    throw new NotFoundError('Product not belong to shop');
                }
            })
        }
    };

    static async removeProductFromCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active',
        };

        return await cart.updateOne(
            query,
            {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            },
        )
    }

    static async getCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId,
        }).lean()
    }
}

module.exports = CartService
