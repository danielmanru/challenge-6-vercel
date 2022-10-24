const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");



router.post('/createHistory', mid.mustLogin, controller.history.create);
router.get('/showHistory', mid.mustLogin, controller.history.show);
router.delete('/deleteHistory/:historyId', mid.mustLogin, controller.history.delete);
router.put('/updateHistory/:historyId', mid.mustLogin, controller.history.update);

module.exports = router;