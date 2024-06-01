
const express = require('express');
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require('../../helpers/asyncHandle');
const { authentication } = require('../../auth/authUtils');


router.use(authentication);

router.post("", asyncHandler(productController.createProduct))



module.exports = router;