const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const SECRET_KEY = require("../../config/secret.js").SECRET_KEY;
const REGIONS = require("../../config/settings").REGIONS;

const { Pool } = require("pg");
const pool = new Pool();

// @route POST api/sqlite/users/register
// @desc Signup user
// @access Public
router.post("/register", (req, res) => {
  // field validation
  const errors = validateRegisterInput(req.body);
  if (errors) {
    return res.status(400).json(errors);
  }

  // if email exists, response with 400 status
  const text = "SELECT COUNT(*) AS count FROM users WHERE email = $1";
  pool
    .query(text, [req.body.email])
    .then(succ => {
      if (succ.rows[0].count > 0) {
        throw { status: 400, email: "Email already exists" };
      }
      return bcrypt.genSalt(10);
    })
    .then(salt => bcrypt.hash(req.body.password, salt))
    .then(hash => {
      const newUser = {
        email: req.body.email,
        password: hash,
        name: req.body.name,
        role: req.body.role,
        kodas: req.body.kodas || undefined,
        regbit: REGIONS[req.body.region].bit,
        //meistrija: req.body.meistrija || undefined,
        active: false
      };

      const keys = Object.keys(newUser);
      const keyString = keys.join(", ");
      const valString = keys.map((key, index) => "$" + (index + 1)).join(", ");
      const values = keys.map(key => newUser[key]);
      const insertText = `INSERT INTO users (${keyString}) VALUES (${valString}) RETURNING *`;
      console.log("insert", insertText);
      return pool.query(insertText, values);
    })
    .then(succ => {
      const insertedUser = succ.rows[0];
      if (!insertedUser) {
        throw { message: "Insert unsuccessful" };
      }
      delete insertedUser.password;
      res.status(200).json(insertedUser);
    })
    .catch(err => {
      console.error(err);
      if (err.status) {
        return res.status(err.status).json(err);
      } else {
        return res.status(500).json(err);
      }
    });
});

// @route POST api/sqlite/users/login
// @desc Login user
// @access Public
router.post("/login", (req, res) => {
  // error list won't be shown to the user,
  // just a general 'login unsuccessful' instead
  const badLoginResponse = { message: "wrong email or password" };

  // validate fields
  const errors = validateLoginInput(req.body);
  if (errors) {
    return res.status(400).json(errors);
  }

  // Find user by email
  const text = "SELECT * FROM users WHERE email = $1 AND active = TRUE";
  pool
    .query(text, [req.body.email])
    .then(succ => {
      const user = succ.rows[0];
      if (!user) {
        throw { status: 404, message: "wrong email or password" }
      };
      // email found, check if passwords match
      bcrypt
        .compare(req.body.password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // email and password match
            // create jwt payload
            const payload = {
              email: user.email,
              name: user.name,
              role: user.role,
              kodas: user.kodas,
              region: Object.keys(REGIONS).find(
                regionId => REGIONS[regionId].bit === user.regbit
              )
            };
            // ty to sign the jwt and send to client
            try {
              const token = jwt.sign(payload, SECRET_KEY, {expiresIn: 36000});
              console.log("login OK");
              res.status(200).json({
                  success: true,
                  user: payload,
                  token: "Bearer " + token
                });
            } catch (err) {
              console.error("JWT token signing error", err);
              res.status(500).json(err);
            }
          } else {
            // isMatch = false, email and password don't match
            res.status(404).json({message: "wrong email or password" });
          }
        })
        .catch(err => {
          console.error("bcrypt.compare error", err);
          res.status(500).json(err);
        });
    })
    .catch(err => {
      console.error("query user error", err);
      if (err.status) {
        res.status(err.status).json(err);
      } else {
        res.status(500).json(err);
      }
    });
});

// @route GET api/sqlite/users/current
// @desc Get current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log("req.user", req.user);
    res.json({
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      kodas: req.user.kodas,
      region: Object.keys(REGIONS).find(
        regionId => REGIONS[regionId].bit === req.user.regbit
      )
    });
  }
);

module.exports = router;
