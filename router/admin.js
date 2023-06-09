const express = require("express");

const adminController = require("../controller/adminController");
const { authenticated } = require("../middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(fs.existsSync("public")){
            fs.mkdirSync("public");
        }

        if(fs.existsSync("public/videos")){
            fs.mkdirSync("public/videos")
        }

        cb(null, "public/videos");
    },
    filename: function(reqm, file, cb){
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        var ext = path.extname(file.originalname);

        if(ext !== ".mkv" && ext !== ".mp4"){
            return cb(new Error("ارووووروو دادادااااش"))
        }

        cb(null, true);
    }
})




const router = express.Router();

router.get('/dashboard',adminController.getDashboard);
router.get("/get-all-courses", adminController.getAllCourses);
router.delete("/delete-course/:id",  adminController.deleteCourse);
router.patch("/edit-course/:id" ,adminController.editPost);
router.get("/dashboard/post/:id", adminController.getPost);
router.post("/sign-related", adminController.relatedAd);
router.post("/questions-course", adminController.courseQustions);
router.get("/get-questions", adminController.getQuestions);
router.post("/get-single-question/:id", adminController.getSingleQuestion);
router.post("/delete-question", adminController.deleteQuestion);
router.post("/answer-question", adminController.answerQuestion);
router.post("/delete-answer", adminController.deleteAnswer);
// router.post("/upload-video", adminController.videoUpload);
router.get("/teachers-request", adminController.getTeacherRequests);
router.post("/payment-teacher", adminController.payTeachers);
router.post("/edit-user-from-admin", adminController.editUserFromAdmin);
// router.post("/suqqestion-setter", adminController.suqqestions)




router.post("/add-new-video", upload.fields([
    {
        name: "videos",
        maxCount: 5
    }
]) , adminController.create)

module.exports = router;