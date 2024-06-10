const { Created, Ok, SuccessResponse } = require('../core/success.response')
// const ProductService = require('../services/product.service');
const ProductService = require('../services/product.service.xxx')

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
        }).send(res)
    }

    /**
     * Asynchronously retrieves all Publish for a shop and sends an Ok response with the metadata of the drafts.
     *
     * @param {Object} req - The request object containing the user ID in the request body.
     * @param {Object} res - The response object used to send the response.
     * @param {Function} next - The next middleware function in the chain.
     * @return {Promise<void>} A promise that resolves when the response is sent.
     */
    async getAllPublishForShop(req, res, next) {
        return new Ok({
            message: 'Get all drafts successfully',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    async publishProduct(req, res, next) {
        return new SuccessResponse({
            message: 'Publish successfully',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    async unPublishProduct(req, res, next) {
        return new SuccessResponse({
            message: 'UnPublish successfully',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    async getListSearchProduct(req, res, next) {
        return new SuccessResponse({
            message: 'Search successfully',
            metadata: await ProductService.searchProductByUser(req.params),
        }).send(res)
    }

    async getAllProducts(req, res, next) {
        return new SuccessResponse({
            message: 'getAllProducts successfully',
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res)
    }

    async getProduct(req, res, next) {
        return new SuccessResponse({
            message: 'getProduct successfully',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res)
    }

    async updateProduct(req, res, next) {
        return new SuccessResponse({
            message: 'updateProduct successfully',
            metadata: await ProductService.updateProduct(
                req.body.type,
                req.params.product_id,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res)
    }
}

module.exports = new ProductController()
