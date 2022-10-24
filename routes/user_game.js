const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");



router.post('/auth/register', controller.auth.register);
router.post('/auth/login', controller.auth.login);
router.delete('/auth/deleteuser', mid.mustLogin, controller.auth.deleteDataUser);
router.put('/auth/changePassword', mid.mustLogin, controller.auth.changePassword);

module.exports = router;