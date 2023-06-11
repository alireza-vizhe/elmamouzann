const { default: axios } = require("axios");
const User = require("../module/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../module/PostModel");
const Teacher = require("../module/teacherModel");
const {
  sendEmail,
  sendRelatedEmail,
  sendContactUsEmail,
  sendLogin,
  sendProfileUpdate,
  sendNewTeacherResquestEmail,
} = require("../utils/mailer");
const request = require("request-promise");
const ZarinpalCheckout = require("zarinpal-checkout");
const qs = require("qs");

const { v4: uuidv4 } = require("uuid");

exports.getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("مشکلی از سمت سرور پیش امده است");
  }
};

exports.addUser = async (req, res) => {
  console.log(req.body);
  const { email, recaptchaValue, fullname, password } = req.body;
  try {
    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      method: "POST",
    }).then(async ({ data }) => {
      if (!data.success) {
        const userFinder = await User.findOne({ email });
        if (userFinder) {
          res.json({ message: "کاربری با این ایمیل موجود می باشد" });
        } else {
          const hash = await bcrypt.hash(password, 10);
          const user = await User.create({
            fullname,
            email,
            password: hash,
          });
          res.json(user);
          sendEmail(
            email,
            fullname,
            "خوش آمدی به علم آموزان",
            "دوره های بهترین اساتید تایید شده را شرکت کنید علم خود را با راه درست و اطلاعات درست بالا ببرید"
          );
        }
      } else {
        res.json({ message: "کپچا نا معتبر است" });
      }
    });
  } catch (error) {
    res.json({ message: "مشکلی از سمت سرور پیش آمد" });
  }
};

exports.handleLogin = async (req, res) => {
  try {
    const { email, fullname, password, recaptchaValue } = req.body;

    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      method: "POST",
    })
      .then(async ({ data }) => {
        console.log(data);
        if (!data.success) {
          const user = await User.findOne({ email });
          console.log(user);
          if (!user) {
            res.json({ message: "کاربری با این ایمیل یافت نشد" });
            return;
          }

          const isEqual = await bcrypt.compare(password, user.password);

          if (isEqual) {
            const token = jwt.sign(
              {
                user: {
                  userId: user._id.toString(),
                  email: user.email,
                  fullname: user.fullname,
                },
              },
              process.env.JWT_SECRET
            );
            res.status(200).json({ token, userId: user._id.toString() });
            sendLogin(
              email,
              fullname,
              "دستگاه جدید به حسابتان وارد شد",
              "یک دستگاه جدیدی به حساب علم آموزتان وارد شد اگر شما نبوده اید به پشتیبانی اطلاع دهید برای بررسی"
            );
            if (
              !user.about ||
              !user.address ||
              !user.age ||
              !user.expertise ||
              !user.phone
            ) {
              sendProfileUpdate(
                email,
                fullname,
                "پروفایل شما تکمیل نیست",
                "پیشنهاد ما هرچه سریعتر پروفایل خود را تکمیل کنید تا بتوانید تجربه کاربری بهتری داشته باشید, برای انجام این کار روی اسم خود در صفحه اصلی کلیک کرده و پروفایل را انتخاب کنید!"
              );
            }
          } else {
            res.json({ message: "آدرس ایمیل یا کلمه عبور اشتباه است" });
          }
        } else {
          res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
        }
      })
      .catch((error) => {
        res.json({ message: "کپچا نا معتبر است" });
      });
  } catch (error) {
    res.json({ message: "مشکلی از سمت سرور پیش آمد" });
  }
};

exports.getSingleCourse = async (req, res) => {
  console.log(req.params.id);
  try {
    const course = await Post.findById({ _id: req.params.id });
    // console.log(course);
    res.json(course);
  } catch (error) {
    console.log(error);
  }
};

exports.amountVisits = async (req, res) => {
  try {
    const course = await Post.findOne({ _id: req.params.id });
    course.visits = course.visits + 1;
    course.save();
    console.log(course.visits);
  } catch (error) {
    console.log(error);
  }
};

exports.amountSellCourse = async (req, res) => {
  try {
    const course = await Post.findOne({ _id: req.params.id });
    course.totalStudents = course.totalStudents + 1;
    course.save();
    const user = await User.findOne({ _id: course.userId });
    user.courses = [...user.courses, course];
    user.save();
    console.log("tapdmmmmmmmm", user);
    console.log(course.totalStudents);
  } catch (error) {
    console.log(error);
  }
};

exports.handleForgetPassword = (req, res) => {
  try {
    const { email, userId, recaptchaValue } = req.body;
    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      method: "POST",
    })
      .then(async ({ data }) => {
        if (!data.success) {
          console.log(data);
          const user = await User.findOne({ email });
          if (!user) {
            res.json({
              message: "کاربری با این ایمیل در پایگاه داده ثبت نشده است",
            });
            console.log("no data");
          } else {
            // const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            //   expiresIn: "1h"
            // })

            const resetLink = `https://elmamouzannn.netlify.app/reset-password/${user._id}`;
            sendEmail(
              user.email,
              user.fullname,
              "فراموشی رمز عبور",
              `جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید <a href=${resetLink}>لینک تغییر رمز عبور</a>`
            );

            res.json({ messageSUC: "لینک ریست کلمه عبور با موفقیت ارسال شد" });
            console.log("sended");
          }
        } else {
          res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
        }
      })
      .catch((error) => {
        res.json({ message: "کپچا نا معتبر است" });
      });
  } catch (error) {
    res.json(error);
  }
};

exports.handleResetPassword = (req, res) => {
  console.log(req.body);

  try {
    const { password, confirmPassword, recaptchaValue } = req.body;
    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      method: "POST",
    })
      .then(async ({ data }) => {
        console.log(data);
        if (!data.success) {
          // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          // if(!decodedToken){
          //   res.json({message: "شما مجوز این عملیات را ندارید"});
          // }
          if (password !== confirmPassword) {
            res.json({ message: "کلمه ها عبور یکسان نمیباشند" });
          }

          const user = await User.findOne({ _id: req.params.id });

          console.log(user);

          if (!user) {
            res.json({
              message: "کاربری با این شناسه در پایگاه داده یافت نشد",
            });
          }

          const hash = await bcrypt.hash(password, 10);

          user.password = hash;
          await user.save();
          res.json({ messageSUC: "عملیات با موفقیت انجام شد" });
        } else {
          res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
        }
      })
      .catch((error) => {
        res.end({ message: "کپچا نا معتبر است" });
      });
  } catch (error) {
    res.json({ message: "ارور" });
    console.log("err");
  }
};

exports.editUser = async (req, res) => {
  console.log("body guleyley", req.body);
  try {
    const { recaptchaValue, userId, sended } = req.body;
    // const sendedFinder = await User.findById({_id: userId})
    // console.log("shibidillo", sendedFinder.sended);
    const post = await User.updateOne({ _id: userId }, { $set: req.body });
    console.log(post);
    res.json({ messageSUC: "اطلاعات با موفقیت ویرایش شد" });
    // res.json(post);
  } catch (error) {
    res.json({ message: error.message });
  }
};
exports.addBuyCard = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    const user = await User.findOne({ _id: req.body.userId });
    console.log(user, post.price);
    if(post.suqqestion > 0){
      user.prices = user.prices + parseInt(post.suqqestion);
    }else{
      user.prices = user.prices + parseInt(post.price);
    }
    user.coursesInCard = [...user.coursesInCard, post];
    user.save();
  } catch (error) {
    console.log(error);
  }
};

exports.checker = async (req, res) => {
  try {
    console.log("hahahahahah", req.body);
    const post = await Post.findOne({ _id: req.body.courseId });
    const user = await User.findOne({ _id: req.body.userId });
    post.totalStudents = post.totalStudents + 1;
    post.monthlyStudents = post.monthlyStudents + 1;
    post.sells = [...post.sells, req.body.userId];
    post.save();
    user.prices = 0;
    user.coursesInCard = [];
    user.save();
    console.log(post, "asdasdasdad");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Create ZarinPal
 * @param {String} `1ed2c7a3-b2d4-47a4-a05c-dba78b742c8c` [Merchant ID]
 * @param {Boolean} false [toggle `Sandbox` mode]
 */

const zarinpal = ZarinpalCheckout.create(
  "1ed2c7a3-b2d4-47a4-a05c-dba78b742c8c",
  true
);

exports.buyCourse = async (req, res) => {
  // console.log(req.body);
  try {
    const post = await Post.findOne({ _id: req.body.postId });
    // post.totalStudents = post.totalStudents + 1;
    // post.monthlyStudents = post.monthlyStudents + 1;
    // post.save();
    const user = await User.findOne({ _id: req.body.userId });
    // console.log(post, "asasasasasas", user);
    // user.courses = [...user.courses, post];
    // user.prices = 0
    // user.coursesInCard = []
    // user.save()
    console.log(post.name, post._id, user.prices);

    //! this
    let params = {
      MerchantID: `97221328-b053-11e7-bfb0-005056a205be`,
      Amount: user.prices,
      CallbackURL: "http://localhost:3000/success-pay",
      Description: `بابت خرید دوره ${post.name} متشکریم`,
      Email: user.email,
    };

    let options = {
      method: "POST",
      url: "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
      header: {
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      body: params,
      json: true,
    };

    request(options)
      .then(async (data) => {
        res.json({
          messageURL: `https://zarinpal.com/pg/StartPay/${data.Authority}`,
          courseId: post._id,
        });
        user.coursesIdGeted = [...user.coursesIdGeted, post._id];
        user.save();
      })
      .catch((err) => res.json(err.message));
    //! Until this

    /**
     * PaymentRequest [module]
     * @return {String} URL [Payement Authority]
     */
    // zarinpal
    //   .PaymentRequest({
    //     Amount: user.prices, // In Tomans
    //     CallbackURL: "http://localhost:3000/success-pay",
    //     Description: `بابت خرید دوره ${post.name} متشکریم`,
    //     Email: user.email,
    //     Mobile: user.phone ? user.phone : null,
    //   })
    //   .then((response) => {
    //     // console.log(response);
    //     if (response.status === 100) {
    //       zarinpal
    //         .PaymentVerification({
    //           Amount: user.prices, // In Tomans
    //           Authority: response.authority,
    //         })
    //         .then((response) => {
    //           if (response.status === -21) {

    //             post.totalStudents = post.totalStudents + 1;
    //             post.monthlyStudents = post.monthlyStudents + 1;
    //             post.sells = [...post.sells, req.body.userId];
    //             console.log(req.body.postId, req.body.userId);
    //             post.save();
    //             console.log("response", response);
    //             // user.courses = [...user.courses, req.body.postId];
    //             user.prices = 0
    //             user.coursesInCard = [];
    //             user.save();

    //           } else {
    //             console.log(`Verified! Ref ID: ${response.RefID}`);
    //           }
    //         })
    //         .catch((err) => {
    //           console.log("asrreere", err)
    //         });
    //       res.json({ messageURL: response });
    //       console.log("asas2222", response);
    //     } else {
    //       res.json({ message: "پرداخت با موفقیت انجام نشد!" });
    //       console.log("lolo");
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    //   var data = qs.stringify({
    //     'api_key': '2d382d00-4710-4ebc-8e79-403533c2da19',
    //     'amount': user.prices,
    //     'callback_uri': "http://localhost:3000/success-pay",
    //     'order_id': JSON.stringify(post._id),
    //     'customer_json_fields': `{"productName": ${post.name}, "id": ${JSON.stringify(post._id)}}`,
    //   })

    //   console.log("asasasasas", data);

    //   var config = {
    //     method: 'post',
    //     url: "https://nextpay.org/nx/gateway/token",
    //     data: data
    //   }

    //   axios(config).then(function (response) {
    //     console.log("شسشسشس", JSON.stringify(response.data));
    //     user.paymentDetail = response.data
    //     user.save()

    //     request(config).then(async data => {
    //   res.json({messageURL : `https://nextpay.org/nx/gateway/payment/${response.data.trans_id}`});
    // }).catch(err => res.json(err.message))

    //     // res.redirect(`https://nextpay.org/nx/gateway/payment/${response.data.trans_id}`)
    //   }).catch(function (error) {
    //     console.log("ارور", error);
    //   })

    //   var data2 = qs.stringify({
    //     'api_key': '2d382d00-4710-4ebc-8e79-403533c2da19',
    //     'amount': user.prices,
    //     'trans_id': user.paymentDetail.trans_id
    //     });
    //     console.log("data2", data2);
    //     var config2 = {
    //       method: 'post',
    //       url: 'https://nextpay.org/nx/gateway/verify',
    //       data : data2
    //     };

    //     axios(config2)
    // .then(function (response) {
    // // console.log(response);
    // console.log("نهایی",JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    // console.log("نهایsdsی", error);
    // });

    // if(user.prices > 0){
    //   let params = {
    //     MerchantId: "1ed2c7a3-b2d4-47a4-a05c-dba78b742c8c",
    //     Amount : user.prices,
    //     CallBackURL: "http://localhost:5000/courses/payment/checker",
    //     Description: `بابت خرید دوره ${post.name} متشکریم`,
    //     Email: user.email
    //   }
    //   let options = {
    //     method: "POST",
    //     uri: 'https://api.zarinpal.com/pg/v4/payment/request.json',
    //     headers: {
    //       'cache-control': "no-cache",
    //       'content-type': "application/json"
    //     },
    //     body: params,
    //     json: true
    //   }
    //   request(options).then(data => {
    //     console.log("susu", data);
    //   }).catch(error => console.log('gogo', error))
    // }

    // user.save();
    // res.json({messageSUC: "دوره با موفقیت به حساب شما اضافه شد"})
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.json({ message: error.message });
  }
};
exports.sendEmailToContactUs = async (req, res) => {
  console.log(req.body);
  const { fullname, email, message } = req.body;
  try {
    sendContactUsEmail(
      "alirezavizhe@gmail.com",
      fullname,
      `پیامی از طرف کاربری با ایمیل ${email} دریافت شد`,
      message
    );
    res.json({ messageSUC: "پیام شما با موفقیت ارسال شد" });
  } catch (error) {
    console.log("error", error);
  }
};

exports.removeInCard = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const post = await Post.findOne({ _id: postId });
    const user = await User.findOne({ _id: userId });
    const del = user.coursesInCard.filter((item) => item._id != postId);
    const delFind = user.coursesInCard.filter((item) => item._id == postId);
    user.coursesInCard = del;
    if(post.suqqestion > 0){
      // user.prices = user.prices - parseInt(post.suqqestion);
      user.prices = 0
    }else{
      // user.prices = user.prices - parseInt(post.price);
      user.prices = 0
    }
    console.log(delFind);
    user.save();
    res.json({
      messageSUC: `دوره ${delFind.map(
        (item) => item.name
      )} با موفقیت از سبد خرید شما پاک شد`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.comments = async (req, res) => {
  console.log(req.body);
  try {
    const { password, confirmPassword, recaptchaValue } = req.body;
    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      method: "POST",
    })
      .then(async ({ data }) => {
        console.log(data);
        if (!data.success) {
          const post = await Post.findOne({ _id: req.body.id });
          post.comments = [
            ...post.comments,
            {
              message: req.body.comments,
              name: req.body.commenterName,
              commentedAt: req.body.commentedAt,
              answer: [],
              id: uuidv4(),
            },
          ];
          // console.log(req.body);
          post.commenterName = [...post.commenterName, req.body.commenterName];
          // post.commentedDate = [...post.commentedDate, req.body.commentedDate]
          post.save();
          // console.log(post);
          res.json(post);
        } else {
          res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
        }
      })
      .catch((error) => {
        res.json({ message: "کپچا نا معتبر است" });
      });
  } catch (error) {
    console.log("erereoreorero");
  }
};

exports.updateComments = async (req, res) => {
  // console.log(req.body);
  try {
    const post = await Post.findOne({ _id: req.body.id });
    // console.log(post.comments.answer);
    // post.comments.answer = [...post.comments.answer, req.body.answerComments]
    // post.comments.answererName = req.body.answererName
    post.answerComments = [...post.answerComments, req.body.answerComments];
    post.save();
    console.log(post.answerComments);
    res.json(post);
  } catch (error) {}
};

exports.getComments = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const post = await Post.findOne({ _id: req.body.id });
    res.json(post);
  } catch (error) {
    console.log("sishdon");
  }
};

exports.deleteComment = async (req, res) => {
  console.log(req.body);
  try {
    const post = await Post.findOne({ _id: req.body.postId });
    post.comments = post.comments.filter(
      (item) => item.id !== req.body.commentId
    );
    post.save();
    console.log(post.comments);
    res.json(post);
  } catch (error) {}
};
exports.like = async (req, res) => {
  console.log(req.body);
  try {
    const post = await Post.findOne({ _id: req.body.id });
    console.log(post);
    post.likes = post.likes + 1;
    post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};
exports.setPrice = async (req, res) => {
  console.log("sikiminBashi", req.body);
  try {
    const user = await User.findOne({ _id: req.body.id });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

exports.teacher = async (req, res) => {
  try {
    const findTeach = await Teacher.findOne({ email: req.body.email });
    if (findTeach) {
      res.json({ message: "درخواستی با این ایمیل ثبت شده است" });
    } else {
      const teach = await Teacher.create(req.body);
      console.log(teach);
      res.json({ messageSUC: "درخواست با موفقیت ثبت شد" });
      sendNewTeacherResquestEmail(
        "alirezavizhe@gmail.com",
        teach.fullname,
        "درخواست همکاری جدید",
        `یک درخواست همکاری جدید ثبت شد برای چک کردن این درخواست به داشبود > و اسکرول کنید وسط صفحه`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.teacherRank = async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.findOne({ _id: req.body.id });
    user.rank = user.rank + 1;
    user.save();
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};
