const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done({ message: "User or Password is incorrect" });
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch)
        return done({ message: "User or Password is incorrect" });
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      if (payload.exp < Date.now() / 1000) return done(null, false);
      const user = await User.findById(payload._id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = { localStrategy, jwtStrategy };
