const express = require("express");

const userController = require("../controller/userController");
const { authenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/users", userController.getUser);
router.post("/register-user", userController.addUser);
router.post("/login-user", userController.handleLogin);
router.get("/course/:id", userController.getSingleCourse);
router.post("/visit-course/:id", userController.amountVisits);
router.post("/students-course/:id", userController.amountSellCourse);
router.post("/forget-password", userController.handleForgetPassword);
router.post("/reset-password/:id", userController.handleResetPassword);
router.post("/edit-user/:id", userController.editUser);
router.post("/add-to-card/:id", userController.addBuyCard);
router.get("/single-user/:id", userController.getSingleUser);
router.post("/contact-us", userController.sendEmailToContactUs);
router.post("/delete-post-in-card", userController.removeInCard);
router.post("/comment", userController.comments);
router.post("/get-comments", userController.getComments);
router.post("/answer-com", userController.updateComments);
router.post("/like-course", userController.like);
router.post("/prices", userController.setPrice);
router.post("/teachers", userController.teacher);
router.post("/buy-course", userController.buyCourse);
router.post("/teacher-rank", userController.teacherRank);
router.post("/delete-comment", userController.deleteComment);
router.post("/courses/payment/checker", userController.checker)

module.exports = router;