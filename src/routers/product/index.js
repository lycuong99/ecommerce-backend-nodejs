
const express = require('express');
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require('../../helpers/asyncHandle');
const { authentication } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.getAllProducts)) 
router.get('/:product_id', asyncHandler(productController.getProduct)) 
router.use(authentication);

router.post('', asyncHandler(productController.createProduct))
router.patch('/:product_id', asyncHandler(productController.updateProduct))


router.put('/publish/:id', asyncHandler(productController.publishProduct))
router.put('/unpublish/:id', asyncHandler(productController.unPublishProduct))

//QUERY
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop))
router.get("/published/all", asyncHandler(productController.getAllPublishForShop))



module.exports = router;