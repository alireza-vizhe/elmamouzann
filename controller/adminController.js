const { default: axios } = require("axios");
const Post = require("../module/PostModel");
const Related = require("../module/RelatedModel");
const { sendRelatedEmail } = require("../utils/mailer");
const User = require("../module/UserModel");
const Question = require("../module/qestionsModel");
const Teacher = require("../module/teacherModel");

exports.getDashboard = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.log("err");
  }
}

exports.getPost = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    try {
        const fPost = await Post.findOne({_id: id})
        res.json(fPost)
    } catch (error) {
        console.log(error);
    }
}

exports.editPost = async (req, res) => {

    try {
        const { recaptchaValue } = req.body;
        axios({
          url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
          method: "POST",
        })
          .then(async ({ data }) => {
            console.log("data", data);
            if (!data.success) {
              const post = await Post.updateOne(
                { _id: req.params.id },
                { $set: req.body }
              );
              res.json(post);
              console.log(post);
            } else {
              res.json({ message: "مشکلی در اعتبار سنجی کپچا پیش آمد" });
            }
          })
          .catch((error) => {
            res.json({ message: "کپچا نا معتبر است" });
          });
      } catch (error) {
        res.json({ message: error.message });
      }
}

exports.create = async (req, res) => {
    const {name} = req.body;
    let videoPaths = [];

    if(Array.isArray(req.files.videos) && req.files.videos.length > 0){
        for(let video of req.files.videos){
            videoPaths.push("/" + video.path);
        }
    }
    try {
        const createdMedia = await Post.create({
            name,
            videos: videoPaths
        })
        res.json({message: "ایجاد شد", createdMedia})
    } catch (error) {
        console.log("erororororororor", error);
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const post = await Post.find();
        res.json(post)
    } catch (error) {
        console.log(error);
    }
}

exports.deleteCourse = async (req, res) => {
    console.log(req.params.id);
    try {
        await Post.deleteOne({_id: req.params.id});
        res.json({message: "دروه مد نظر با موفقیت پاک شد"})
    } catch (error) {
        res.json({message: error.message})
    }
}
exports.editPost = async (req, res) => {
  console.log(req.body.courseExam);
    try {
        const { recaptchaValue } = req.body;
        axios({
          url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
          method: "POST",
        })
          .then(async ({ data }) => {
            console.log("data", data);
            if (!data.success) {
              const post = await Post.updateOne(
                { _id: req.params.id },
                { $set: req.body }
              );
              res.json(post);
              console.log(post);
            } else {
              res.json({ message: "مشکلی در اعتبار سنجی کپچا پیش آمد" });
            }
          })
          .catch((error) => {
            res.json({ message: "کپچا نا معتبر است" });
          });
      } catch (error) {
        res.json({ message: error.message });
      }
}
exports.relatedAd = (req, res) => {
  try {
      const {fullname, email, recaptchaValue} = req.body;
      axios({
          url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
          method: "POST",
        }).then( async ({data}) => {
          if(!data.success){
            const relatedUser = await Related.findOne({email});
            if(relatedUser){
              res.json({message: "کاربری با این ایمیل در خبرنامه شرکت کرده است"});
            }else{
              await Related.create({fullname, email})
              res.json({messageSUC: "با موفقیت در خبرنامه شرکت کردید"});
              sendRelatedEmail(
               email,
               fullname,
               "شرکت در خبرنامه پیامکی تیمزیاب موفقیت آمیز بود",
               "امیدواریم بتونیم بهترین آگهی های مرتبط با حوزه کاری شما را به شما اطلاع رسانی کنیم که هرچه زودتر شروع به کار کنید!"
             );
            }
          }else {
              res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
            }
          })
          .catch((error) => {
            res.json({ message: "کپچا نا معتبر است" });
          });
  } catch (error) {
      console.log(error);
      res.status(500).send("مشکلی از سمت سرور پیش امده است");
  }
}
exports.courseQustions = async (req, res) => {
  console.log(req.body);
  try {
    const {recaptchaValue} = req.body;
    axios({
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
        method: "POST",
      }).then( async ({data}) => {
        if(!data.success){
          console.log(data);
     await Question.create(req.body);
     res.json({messageSUC: "سوال شما با موفقیت ثبت شد"})
    // questions = [...questions, req.body]
    // questions.save()
    // console.log(post, user);
  }else {
    res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
  }
})
.catch((error) => {
  res.json({ message: "کپچا نا معتبر است" });
});
  } catch (error) {
    console.log(error);
  }
}

exports.getQuestions = async (req, res) => {
  try {
   const questions = await Question.find();
    res.json(questions)
  } catch (error) {
    console.log(error);
  }
}

exports.getSingleQuestion = async (req, res) => {
  console.log(req.params);
  try {
    const question = await Question.findOne({_id: req.params.id});
    console.log(question);
    res.json(question);
  } catch (error) {
    
  }
}

exports.deleteQuestion = async (req, res) => {
  console.log(req.body);
  try {
    await Question.deleteOne({_id: req.body.id})
  } catch (error) {
    
  }
}
exports.answerQuestion = async (req, res) => {
  console.log("شدسصثققققققق", req.body);
  try {
    const {recaptchaValue} = req.body;
    axios({
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
        method: "POST",
      }).then( async ({data}) => {
        if(!data.success){
    const question = await Question.findOne({_id: req.body.id})
    question.answer = [...question.answer, req.body];
    question.save();
    console.log(question);
    res.json({messageSUC: "پاسخ شما با موفقیت ثبت شد"})
  }else {
    res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
  }
})
.catch((error) => {
  res.json({ message: "کپچا نا معتبر است" });
});
  } catch (error) {
    console.log(error);
  }
}

exports.deleteAnswer = async (req, res) => {
  console.log(req.body);
  try {
   const question = await Question.findOne({_id: req.body.questionId});
   question.answer = question.answer.filter(item => item.answerId !== req.body.answerId)
   question.save()
  } catch (error) {
    console.log(error);
  }
}

// exports.videoUpload = async (req, res) => {

//   console.log(req.body);

//   const videoDetail = req.body

//   try {
//     const course = await Post.findOne({_id: req.body.courseId});
//     console.log(course.courseVideos);
//     course.courseVideos = [{...course.courseVideos, videoDetail}]
//     course.save()
//     console.log("course");
//   } catch (error) {
//     console.log(error);
//   }
// 

exports.getTeacherRequests = async (req, res) => {
  try {
    const teachersRequest = await Teacher.find();
    res.json(teachersRequest)
    console.log(teachersRequest);
  } catch (error) {
    console.log(error);
  }
}
exports.payTeachers = async (req, res) => {
  try {
    const course = await Post.findOne({_id: req.body.courseId});
    if(!course){
      res.json({message: "دوره ای با این مشخصات وحود ندارد!"})
    }
    course.monthlyStudents = 0;
    course.save();
    res.json({messageSUC: "با موفقیت با این دوره استاد تسویه حساب شد"})
  } catch (error) {
    console.log();
  }
}
exports.editUserFromAdmin = async (req, res) => {
  console.log(req.body, req.params);
  try {
   const user = await User.findOne({_id: req.body.id})
   user.isAdmin = req.body.isAdmin;
   user.teacher = req.body.teacher;
   user.fromUniversity = req.body.fromUniversity
   user.save()
    if(!user){
      res.json({message: "کاربری با این مشخصات وجود ندارد"})
    }
    res.json({messageSUC: "کاربر مورد نظر با موفقیت آپدیت شد"})
  } catch (error) {
    console.log(error);
  }
}

// exports.suqqestions = async (req, res) => {
//   try {
//     const post = await Post.findOne({_id: req.body.id});
//     post.suqqestion = req.body.suqqestion;
//     post.save();
//     console.log(post.suqqestion);
//   } catch (error) {
//     console.log(error);
//   }
// }