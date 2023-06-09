const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
  console.log(req.get("Authorization"));
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) {
      res.json({ message: "مجوز کافی ندارید" });
    } else if(authHeader === "Bearer null"){
      res.json({ message: "مجوز کافی ندارید" });
    }else if(authHeader === "Bearer undefined"){
      res.json({ message: "مجوز کافی ندارید" });
    }
    
    const token = authHeader.split(" ")[1];
    const decodecdToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodecdToken) {
      res.json({ message: "شما مجوز کافی برای انجام این کار را ندارید" });
    }

    req.userId = decodecdToken.user.userId;
    req.fullname = decodecdToken.user.fullname;
    req.createdAt = decodecdToken.user.createdAt;
    req.isAdmin = decodecdToken.user.isAdmin;
    req.email = decodecdToken.user.email;
    req.phone = decodecdToken.user.phone;
    req.age = decodecdToken.user.age;
    req.address = decodecdToken.user.address;
    req.expertise = decodecdToken.user.expertise;
    req.courses = decodecdToken.user.courses;
    console.log(decodecdToken.user);
    next();
  } catch (error) {
    console.log("errrrrr");
  }
};
