const admin = require("./../firebase");
const User = require("./../models/userModel");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    // console.log("firebaseUser", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log("error in authCheck middleware");
    res.status(401).json({
      err: "Invalid or expired token.",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (adminUser.role !== "admin") {
    console.log("within if statement adminCheck");
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    console.log("within else statement adminCheck");
    next();
  }
};
