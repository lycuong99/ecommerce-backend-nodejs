
const express = require('express');
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require('../../helpers/asyncHandle');
const { authentication } = require('../../auth/authUtils');


//sign up
router.post("/shop/signup", asyncHandler(accessController.signUp))
router.post("/shop/login", asyncHandler(accessController.login))

router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout))
router.post("/shop/refresh-token", asyncHandler(accessController.handleRefreshToken))


module.exports = router;