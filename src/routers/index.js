
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

const PERMISSION_BASE = '0000';
router.use(apiKey);
router.use(permission(PERMISSION_BASE));

router.use("/api/v1/product", require("./product"));
router.use("/api/v1/discount", require("./discount"));
router.use("/api/v1/cart", require("./cart"));
router.use("/api/v1/checkout", require("./checkout"));
router.use("/api/v1", require("./access"));




module.exports = router;