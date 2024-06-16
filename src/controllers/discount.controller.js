const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
    async createDiscountCode(req, res) {
        return new SuccessResponse({
            message: 'createDiscountCode successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res)
    }

    async getAllDiscountCode(req, res) {
        return new SuccessResponse({
            message: 'getAllDiscountCode successfully',
            metadata: await DiscountService.getAllDiscountByShopId(
                req.query
            ),
        }).send(res)
    }

    async getAllDiscountCodeByProductId(req, res) {
        return new SuccessResponse({
            message: 'getAllDiscountCodeByProductId successfully',
            metadata: await DiscountService.getAllDiscountCodeByProduct({
                ...req.query,
            }),
        }).send(res)
    }

    async getAllProductByDiscountCode(req, res) {
        return new SuccessResponse({
            message: 'getAllProductByDiscountCode successfully',
            metadata: await DiscountService.getAllProductsWithDiscount({
                ...req.query,
            }),
        }).send(res)
    }

    async getDiscountAmount(req, res) {
        console.log('req.body::', req.body)
        return new SuccessResponse({
            message: 'getDiscountAmount successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res)
    }

    async deleteDiscountCode(req, res) {
        return new SuccessResponse({
            message: 'deleteDiscountCode successfully',
            metadata: await DiscountService.deleteDiscountCode({
                ...req.params,
                shopId: req.user.userId,
            }),
        }).send(res)
    }

    async cancelDiscountCode(req, res) {
        return new SuccessResponse({
            message: 'cancelDiscountCode successfully',
            metadata: await DiscountService.cancelDiscountCode({
                ...req.query,
            }),
        }).send(res)
    }
}

module.exports = new DiscountController()
