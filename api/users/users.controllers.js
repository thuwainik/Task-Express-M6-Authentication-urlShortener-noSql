const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  console.log(payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_TOKEN_EXP}`,
  });
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);

    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
