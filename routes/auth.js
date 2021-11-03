const { Router } = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { body } = require("express-validator");

const router = Router();

router.post("/signup", body("email").isEmail(), signup);
router.post("/signin", body("email").isEmail(), signin);
router.get("/signout", signout);

router.param("userId", userById);

module.exports = router;
