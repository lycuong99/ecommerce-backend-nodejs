const { SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
    /**
     * Adds a product to the cart and returns a success response with the updated cart metadata.
     *
     * @param {Object} req - The request object containing the product details.
     * @param {Object} res - The response object used to send the response.
     * @return {Promise<void>} A promise that resolves when the response is sent.
     */
    async addToCart(req, res) {
        return new SuccessResponse({
            message: 'addProductToCart successfully',
            metadata: await CartService.addProductToCart(req.body),
        }).send(res)
    }

    /**
     * Update + -
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
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
