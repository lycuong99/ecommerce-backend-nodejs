
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

const PERMISSION_BASE = '0000';
router.use(apiKey);
router.use(permission(PERMISSION_BASE));

router.use("/api/v1", require("./access"));




module.exports = router;