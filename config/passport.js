/** @format */

const JwtStrategy = require("passport-jwt").Strategy;
const users = require("../models/User");

const { authCookieExtractor } = require("../utils/cookieExtract");

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = authCookieExtractor;
  opts.secretOrKey = process.env.JWT_SECRET || "$$demoUserDevSECRET%%";

  passport.use(
    "user",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await users
        .findOne({ _id: jwt_payload.id })
        .select(["-password"]);
      if (!user) return done(null, false);
      return done(null, user);
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
