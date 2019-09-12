const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../../db");

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/test
// @desc Just fetch something
// @access Public
router.get("/callback", (req, res, next) => {
  const text1 = "SELECT * FROM test";
  const text2 = "SELECT name FROM test WHERE id=6";
  db.query(text1, null, (err, success) => {
    if (err) {
      return res.status(500).send(err);
    }
    //return res.status(200).send(success.rows[0]);
    console.log("first success", success.rows[0]);
    db.query(text2, null, (err1, success1) => {
      if (err1) {
        return res.status(500).send(err1);
      }
      return res.status(200).send(success1.rows[0]);
    });
  });
});

router.get("/a", (req, res, next) => {
  const text = "SELECT * FROM test";
  db.query(text)
  .then(success => {
    return res.status(200).send(success.rows[0])
  })
  .catch(err => {
    return res.status(500).send(err)
  });
});

module.exports = router;