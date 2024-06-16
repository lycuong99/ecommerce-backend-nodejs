
const express = require('express');
const router = express.Router();
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require('../../helpers/asyncHandle');
const { authentication } = require('../../auth/authUtils');


router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/products', asyncHandler(discountController.getAllProductByDiscountCode));
router.get('/:product_id', asyncHandler(discountController.getAllDiscountCodeByProductId));
router.patch('/cancel', asyncHandler(discountController.cancelDiscountCode));
router.get('/', asyncHandler(discountController.getAllDiscountCode));

router.use(authentication);

router.post('', asyncHandler(discountController.createDiscountCode));

router.delete('/:code', asyncHandler(discountController.deleteDiscountCode));




module.exports = router;