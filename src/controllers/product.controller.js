const { Created, Ok, SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    async createProduct(req, res, next) {
        return new Created({
            message: 'Created successfully',
            metadata: await ProductService.createProduct(req.body.type, {
                ...req.body,
                shop: req.user.userId,
            }),
        }).send(res)
    }
}

module.exports = new ProductController()
