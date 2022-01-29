const User = require("./../models/userModel");
const { toUpperCase } = require("../utils/createFunctions");
// const toUpperCase = (str) => {
//   return str
//     .toLowerCase()
//     .split(" ")
//     .map(function (word) {
//       return word[0].toUpperCase() + word.substr(1);
//     })
//     .join(" ");
// };

exports.createOrUpdateUser = async (req, res) => {
  const { name, email, picture } = req.user;
  // console.log("req.user", req.user);
  if (!name) {
    const nameFromEmail = toUpperCase(email.split("@")[0]);
    // console.log("nameFromEmail", nameFromEmail);
    req.user.nameFromEmail = nameFromEmail;
    // console.log("req.user within if(!name)", req.user);
  }
  const user = await User.findOneAndUpdate(
    { email },
    { name: name || req.user.nameFromEmail, picture },
    { new: true }
  );
  if (user) {
    console.log("User existing in database");
    res.json(user);
  } else {
    console.log("User NOT existing in database");
    const newUser = await new User({
      email,
      name: name || req.user.nameFromEmail,
      picture,
    }).save();
    console.log("User created");
    res.json(newUser);
  }
};

// exports.currentUser = async (req, res) => {
//   User.findOne({ email: req.user.email }).then().catch();
// };

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};
