const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const SECRET_KEY = require("../../config/secret.js").SECRET_KEY;
const REGIONS = require("../../config/settings").REGIONS;


const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});

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
  const stmtCheckEmailText = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
  try {
    const stmtCheckEmail = db.prepare(stmtCheckEmailText);
    const emailExists = stmtCheckEmail.get(req.body.email).count > 0;
    if (emailExists) {
      return res.status(400).json({email: "Email already exists"});
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json(error);
  }

  // create new user
  let newUser = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
    code: req.body.code,
    regbit: REGIONS[req.body.region].bit,
    active: 0
  };

   // hash user's password and respond with a newly created user
  bcrypt.genSalt(10, (error, salt) => {
    if (error) return res.status(500).json(error);
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      if (error) return res.status(500).json(error);
      // set user's password with a hash
      newUser.password = hash; 

      const keysValues = Object.keys(newUser)
        .map(key => ({key, value: newUser[key]}));
      const tableName = "users";
      const stmtText = `INSERT INTO ${tableName} (${
        keysValues.map(kv => kv.key).join(', ')
      }) VALUES (${
        keysValues.map(kv => "@" + kv.key).join(', ')
      })`;
      // console.log("stmtText", stmtText);

      try {
        const info = db.prepare(stmtText).run(newUser);
        if (info.changes < 1) return res.status(500).send({message: "insert unsuccessful"});
        delete newUser.password;
        res.status(200).json(newUser);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    });
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

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const stmtTxt = 'SELECT * FROM users WHERE email = ? AND active = 1';
  let user = null;
  try {
    //throw new Error("test1 error");
    user = db.prepare(stmtTxt).get(email);
    if (!user) {
      return res.status(404).json(badLoginResponse);
    }    
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }

  // email found, check if passwords match
  bcrypt.compare(password, user.password)
  .then(isMatch => {
    if (isMatch) {
      // email and password match
      // create jwt payload
      const payload = {
        email: user.email,
        name: user.name,
        role: user.role,
        code: user.code,
        region: Object.keys(REGIONS).find(regionId => REGIONS[regionId].bit === user.regbit)
      };
      // sign the jwt
      jwt.sign(payload, SECRET_KEY, { expiresIn: 36000 }, (err, token) => {
        if (err) {
          // error signing token
          // console.log("token signing error", err)
          return res.status(500).json(err);
        }
        
        return res.status(200).json(
          {success: true, user: payload, token: "Bearer " + token}
        );
      });
    } else {
      // isMatch = false, email and password don't match
      return res.status(400).json(badLoginResponse);
    }
  })
  .catch(error => {
    // console.log("Bcrypt error", error);
    return res.status(500).json(error)
  });
});

// @route GET api/sqlite/users/current
// @desc Get current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      code: user.code,
      region: Object.keys(REGIONS).find(regionId => REGIONS[regionId].bit === req.user.regbit)
    });
  }
);

module.exports = router;
