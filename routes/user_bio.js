const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");



router.get('/userBio', mid.mustLogin, controller.biodata.show);
router.post('/createBio', mid.mustLogin, controller.biodata.create);
router.put('/updateBio', mid.mustLogin, controller.biodata.update);
router.delete('/deleteBio', mid.mustLogin, controller.biodata.delete);

module.exports = router;