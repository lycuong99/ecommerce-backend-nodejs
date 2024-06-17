const { SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
    async addToCart(req, res) {
        return new SuccessResponse({
            message: 'addProductToCart successfully',
            metadata: await CartService.addProductToCart(req.body),
        }).send(res)
    }
    async update(req, res) {
        return new SuccessResponse({
            message: 'update successfully',
            metadata: await CartService.addProductToCartv2(req.body),
        }).send(res)
    }

    async delete(req, res) {
        return new SuccessResponse({
            message: 'delete successfully',
            metadata: await CartService.removeProductFromCart(req.body),
        }).send(res)
    }

    async get(req, res) {
        return new SuccessResponse({
            message: 'get successfully',
            metadata: await CartService.getCart(req.query),
        }).send(res)
    }

}

module.exports = new CartController()
