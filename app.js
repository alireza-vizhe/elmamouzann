const express = require("express");

const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const multer = require("multer");
const { default: axios } = require("axios");
const sharp = require("sharp");

const Post = require("./module/PostModel");
const Image = require("./module/ImageModel");
const { setHeaders } = require("./middlewares/headers");
const Articles = require("./module/Articles");

const app = express();


//* Body Parser
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(setHeaders)

dotenv.config({path: "./config/config.env"})

//? database Selection
connectDB();


//! Upload Image
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("textImage"), function (req, res) {
  console.log("filre", req.file, "dataaaaaaa", req.body);
  const { recaptchaValue } = req.body;
  // axios({
  //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
  //   method: "POST",
  // })
  //   .then(async ({ data }) => {
  //     if (!data.success) {
  //       console.log("datablulu", data);
        try {
          sharp(req.file.buffer)
            .resize(1080, 1080)
            .jpeg({ quality: 30 })
            .toBuffer()
            .then((data) => {
              console.log(req.file, "adsdasadasdadsadadasdsada");
              const saveImage = new Post({
                ...req.body,
                nameImg: req.body.name,
                img: {
                  data: data,
                  contentType: req.file.mimeType,
                },
                user: req.userId,
                userId: req.body.userId,
                for: req.body.for,
              });
              saveImage
                .save()
                .then(() => {
                  console.log("saved");
                })
                .catch((err) => {
                  console.log(err);
                });
              res.json({ messageSUC: "savedddd" });
            });
        } catch (error) {
          console.log("fgfgfgfgfg");
        }
    //   } else {
    //     res.json({ message: "  در اعتبار سنجی کپچا پیش آمد" });
    //   }
    // })
    // .catch((error) => {
    //   res.json({ message: "کپچا نا معتبر است" });
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
});


//* upload Articles image
app.post("/upload-image-article", upload.single("textImage"), function (req, res) {
  console.log("filre", req.file, "dataaaaaaa", req.body);
  const { recaptchaValue } = req.body;
  // axios({
  //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
  //   method: "POST",
  // })
  //   .then(async ({ data }) => {
  //     if (data.success) {
        // console.log("datablulu", data);
        try {
          sharp(req.file.buffer)
            .resize(1080, 1080)
            .jpeg({ quality: 30 })
            .toBuffer()
            .then((data) => {
              console.log(req.file, "adsdasadasdadsadadasdsada");
              const saveImage = new Articles({
                ...req.body,
                nameImg: req.body.articleName,
                img: {
                  data: data,
                  contentType: req.file.mimeType,
                },
                // user: req.userId,
                // userId: req.body.userId,
                // for: req.body.for,
              });
              saveImage
                .save()
                .then(() => {
                  console.log("saved");
                })
                .catch((err) => {
                  console.log(err);
                });
              res.json({ messageSUC: "مقاله جدید ایجاد شد" });
            });
        } catch (error) {
          console.log("fgfgfgfgfg");
        }
    //   } else {
    //     res.json({ message: "  در اعتبار سنجی کپچا پیش آمد" });
    //   }
    // })
    // .catch((error) => {
    //   res.json({ message: "کپچا نا معتبر است" });
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
});

//? Upload Profile Image
app.post(
  "/upload-course-video",
  upload.single("video"),
  async function (req, res) {
    console.log(req.file, "id", req.body);
    const userImg = await Post.findOne({ user: req.userId });
    if (req.file) {
      if (userImg) {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then(async (data) => {
            // console.log(data);
            const findToSave = await Post.findOne({ user: req.userId });
            const setter = await Post.updateOne(
              { user: req.userId  },
              { courseVideos: req.body.video }
            );
            findToSave.img = {
              data: data,
              contentType: req.file.mimetype,
            };

            findToSave.save();

            console.log("updated");
          });
      } else {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then((data) => {
            const saveImage = new Post({
              name: req.body.name,
              courseVideos: {
                data: data,
                contentType: req.file.mimeType,
              },
              userId: req.body.userId,
              for: req.body.for,
            });
            saveImage
              .save()
              .then(() => {
                console.log("saved");
              })
              .catch((err) => {
                console.log(err);
              });
            res.json({ message: "savedddd" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.json({ message: "عکسی انتخاب نشده است" });
    }
  }
);


//? Upload Profile Image
app.post(
  "/upload-image-profile",
  upload.single("textImage"),
  async function (req, res) {
    console.log(req.file, "id", req.body.userId);
    const userImg = await Image.findOne({ userId: req.body.userId });
    if (req.file) {
      if (userImg) {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then(async (data) => {
            // console.log(data);
            const findToSave = await Image.findOne({ userId: req.body.userId }); 
            const setter = await Image.updateOne(
              { userId: req.body.userId },
              { $set: req.body }
            );
            findToSave.img = {
              data: data,
              contentType: req.file.mimetype,
            };

            findToSave.save();

            console.log("updated");
            res.json({messageSUC: "عکس پروفایل شما با موفقیت بروزرسانی شد"})
          });
      } else {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then((data) => {
            const saveImage = new Image({
              name: req.body.name,
              img: {
                data: data,
                contentType: req.file.mimeType,
              },
              userId: req.body.userId,
              for: req.body.for,
            });
            saveImage
              .save()
              .then(() => {
                console.log("saved");
              })
              .catch((err) => {
                console.log(err);
              });
            res.json({ message: "savedddd" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.json({ message: "عکسی انتخاب نشده است" });
    }
  }
);

app.get("/images", async (req, res) => {
  const alldata = await Image.find();
  // console.log(alldata);
  res.json(alldata);
});



//* routes
app.use(require("./router/user"));
app.use(require("./router/admin"));

app.listen(process.env.PORT, () => console.log(`server started at port ${process.env.PORT}`))