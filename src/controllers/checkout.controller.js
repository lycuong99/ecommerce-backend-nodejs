const { SuccessResponse } = require('../core/success.response')
const { CheckoutService } = require('../services/checkout.service')

class CheckoutController {
    async reviewCheckout(req, res) {
        return new SuccessResponse({
            message: 'reviewCheckout successfully',
            metadata: await CheckoutService.reviewCheckoutOrder(req.body),
        }).send(res)
    }
}

module.exports = new CheckoutController()
