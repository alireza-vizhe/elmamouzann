const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
  host: "mail.alirezavizhe.ir",
  port: 465,
  secure: true,
  auth: {
    user: "teamsyab@alirezavizhe.ir",
    pass: "09383811792teamsyab",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElmAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
    <h6 style="font-size: 20px;">به علم آموزان خوش آمدی ${fullname}</h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message} , لطفا آیدی خود را با هیچکس به اشتراک نزارید!</p>
</div>`,
  });
};

exports.sendResumeEmail = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElmAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;">${fullname} عزیز یک پیشنهاد کاری برات داریم نهایت استفاده رو ازش ببر رفیق</h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
};

exports.sendRelatedEmail = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElmAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;"> خبر نامه پیامکی برای ${fullname} فعال شد </h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
};

exports.sendContactUsEmail = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElmAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;"> پیامی از طرف ${fullname} </h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
};

exports.sendLogin = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElmAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;" یک دستگاه جدید به اکانتتان وارد شد! ${fullname} </h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
}
exports.sendProfileUpdate = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElamAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;" پروفایل خود را تکمیل کنید برای تجربه کاربری بهتر! ${fullname} </h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
}
exports.sendNewTeacherResquestEmail = (email, fullname, subject, message) => {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "elmamouzan@alirezavizhe.ir",
    to: email,
    subject,
    html: `<h3 style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 40px; font-weight: Bold;"><a href="https://teamsyab.ir" style="color: white; text-decoration: none; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">ElamAmouzan</a></h3>
    <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: black; padding: 20px 0;">
    <h6 style="font-size: 20px;" یک درخواست همکاری به عنوان استاد از طرف ${fullname} </h6>
<div>
 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/man-chatting-with-someone-5362687-4487369.png" style="width: 100%;" alt="">
</div>
</div>
<div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; background-color: #5660f2; color: white; padding: 20px 0;">
<p style="font-size: 20px; padding: 0 70px;">${message}</p>
</div>`,
  });
}