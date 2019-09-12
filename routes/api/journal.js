const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Pool } = require("pg");
const pool = new Pool();

const collectionOptions = require("../../config/collections");

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/journal
// @desc Get item journal
// @access Public
router.get("/", (req, res, next) => {
  // console.log("user", req.user);
  const itype = req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(404).send("no collection");
  const mainid = req.query.mainid;
  if (!mainid) return res.status(404).send("no id");
  // Galima daryti užklausą, tikrinant ar mainid yra to paties regbit kaip ir user.regbit - 
  // tam, kad nepasiektų ne savo journal.
  // Bet gal nėra reikalo - nieko baisaus, jeigu pamatys svetimą journal. 
  // Redaguoti jo vistiek negalės.
  const stmtText = `SELECT * FROM ${coll.tables.journal.name} WHERE mainid = $1`;
  pool.query(stmtText, [mainid])
    .then(succ => res.status(200).send(succ.rows))
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
});

module.exports = router;
