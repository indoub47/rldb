const express = require("express");
const router = express.Router();
const passport = require("passport");
const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const checkPermissions = require("../middleware/checkPermissions");
const getCollection = require("../middleware/getCollection");

const begin = db.prepare("BEGIN");
const commit = db.prepare("COMMIT");
const rollback = db.prepare("ROLLBACK");

// A function that always runs in a transaction
function asTransaction(func) {
  // console.log("func1", func);
  return function(...args) {
    begin.run();
    try {
      // console.log("func2", func);
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/journal
// @desc Get item journal
// @access Public
router.get("/",
  getCollection,
  checkPermissions("fetchKmvs", "matyti meistrijos/-ų"),
  (req, res, next) => {
  // console.log("user", req.user);
  const itype = req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(404).send("no collection");
  const email = req.user.email;

  const fetchStmt = `SELECT * FROM ${coll.tables.viewAllLastJ} WHERE meistrija IN (SELECT meistrijaid FROM user_meistrija WHERE useremail = ?) AND ${coll.notPanaikinta}`;
  
  try {
    const items = db.prepare(stmtText).all(email);
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
