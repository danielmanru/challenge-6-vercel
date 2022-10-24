const express = require("express");
const user_game = require("./user_game");
const user_bio = require("./user_bio");
const user_history = require("./user_history");
const router = express.Router();

router.use("/user", user_game);
router.use("/bio", user_bio);
router.use("/history", user_history);


module.exports = router;