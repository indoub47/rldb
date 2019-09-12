const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const secretKey = require('./secret').SECRET_KEY;

const { Pool } = require("pg");
const pool = new Pool();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    const stmt = "SELECT * FROM users WHERE email = $1 AND active = TRUE";
    pool.query(stmt, [jwt_payload.email], (err, succ) => {
      if (err) {
        return done(err, false);
      }
      const user = succ.rows[0];
      if (user) {        
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}