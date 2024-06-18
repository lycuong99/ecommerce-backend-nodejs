const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')

// router.use(authentication);

router.get('', asyncHandler(cartController.get))
router.delete('', asyncHandler(cartController.delete))
router.post('', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.update))

module.exports = router
