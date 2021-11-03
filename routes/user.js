const { Router } = require("express");
const {
  userById,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = Router();

router.get("/", requireSignin, getAllUsers);
router.get("/:userId", requireSignin, getUser);
router.put("/:userId", requireSignin, updateUser);
router.delete("/:userId", requireSignin, deleteUser);

router.param("userId", userById);

module.exports = router;
