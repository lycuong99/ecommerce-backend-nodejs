const { Created, Ok, SuccessResponse } = require('../core/success.response')
// const ProductService = require('../services/product.service');
const ProductService = require('../services/product.service.xxx');


class ProductController {
        /**
     * Asynchronously creates a new product and sends a Created response with the metadata of the created product.
     *
     * @param {Object} req - The request object containing the body of the request.
     * @param {Object} res - The response object used to send the response.
     * @param {Function} next - The next middleware function in the chain.
     * @return {Promise<void>} A promise that resolves when the response is sent.
     */
    async createProduct(req, res, next) {
        return new Created({
            message: 'Created successfully',
            metadata: await ProductService.createProduct(req.body.type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
    /**
     * Asynchronously retrieves all drafts for a shop and sends an Ok response with the metadata of the drafts.
     *
     * @param {Object} req - The request object containing the user ID in the request body.
     * @param {Object} res - The response object used to send the response.
     * @param {Function} next - The next middleware function in the chain.
     * @return {Promise<void>} A promise that resolves when the response is sent.
     */
    async getAllDraftsForShop(req, res, next) {
        return new Ok({
            message: 'Get all drafts successfully',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }
}

module.exports = new ProductController()
