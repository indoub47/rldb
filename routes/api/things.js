const express = require("express");
const router = express.Router();
const passport = require("passport");
const COLLECTIONS = require("../../config/settings").COLLECTIONS;
const REGIONS = require("../../config/settings").REGIONS;
const SQLStatements = require("../SQLStatements");

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});

// @route GET api/sqlite/things/register
// @desc Get register things as one object
// @access Public
router.get("/register", (req, res) => {
  // which collections to return
  const colls = COLLECTIONS.filter(c =>
    c.actions.includes("register_user")
  ).map(c => c.name);

  // will be collected result
  var resultObject = {};

  colls.forEach(coll => {
    try {
      const stmt = db.prepare(`SELECT * FROM ${coll}`);
      const collItems = stmt.all();
      // // console.log("coll, collItems", coll, collItems);
      resultObject[coll] = collItems;
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });
  return res.status(200).json(resultObject);
});

// visi kiti - reikia autorizuotis
router.use(passport.authenticate("jwt", { session: false }));

// // @route GET api/sqlite/things
// // @desc Get things defined by ttype param
// // @access Public
// router.get("/", (req, res, next) => {
//   const coll = COLLECTIONS.find(c => c.name === req.query.ttype);
//   try {
//     let stmtText = `SELECT * FROM ${coll.name}`;
//     // superadm ir dev gauna visų regionų duomenis, kiti gauna tik tuos,
//     // kurie yra bendri visiems arba bendri ne visiems, bet tinka jų regionui
//     if (!["superadm", "dev"].includes(req.user.role) && coll.hasRegion) {
//       selectStmt += ` WHERE regbits & @userRegbit`;
//     }
//     const stmt = db.prepare(stmtText);
//     const items = stmt.all({ userRegbit: req.user.regbit });
//     return res.status(200).json(items);
//   } catch (err) {
//     // console.log("coll error", coll, err);
//     return res.status(500).send(err);
//   }
// });

// @route GET api/sqlite/things/all
// @desc Get all things as one object
// @access Public
router.get("/all", (req, res) => {
  const clientV = req.query.v;
  let dbV;

  // check things on the db version
  try {
    dbV = db.prepare("SELECT int FROM settings WHERE name = 'allThingsV'").get().int;
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: "Checking version error"});
  }

  //console.log("dbV", dbV);
  //console.log("clientV", clientV);

  // if version the same, don't send things
  if (clientV && dbV.toString() === clientV.toString()) {
    return res.status(200).send({things: ""});
  }

  // if versions not equal, fetch the things and send along with the version
  var resultObject = {};
  COLLECTIONS.filter(c => c.actions.includes("all")).forEach(coll => {
    try {
      let selectStmt = `SELECT * FROM ${coll.name}`;
      // superadm ir dev gauna visų regionų duomenis, kiti gauna tik tuos,
      // kurie yra bendri visiems arba bendri ne visiems, bet tinka jų regionui
      if (!["superadm", "dev"].includes(req.user.role) && coll.hasRegion) {
        selectStmt += ` WHERE regbits & @userRegbit`;
      }
      const stmt = db.prepare(selectStmt);
      const collItems = stmt.all({ userRegbit: req.user.regbit });
      resultObject[coll.name] = collItems;
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });
  return res.status(200).json({things: resultObject, v: dbV});
});

// @route POST api/sqlite/things/update
// @desc Update things (replace by draft)
// @access Public
router.post("/update", (req, res) => {
  // UPDATEINAMA TURI BŪTI PRIKLAUSOMAI NUO USERROLE:
  // JEIGU ADMINAS, TAI GALI APDEITINTI VIEN TIK SAVO REGIONO, REGIONS KEISTI NEGALI
  // JEIGU SUPERADMINAS, TAI GALI APDEITINTI VISUS, GALI KEISTI REGIONS
  // JEIGU KITOS ROLĖS, TAI NEGALI APDEITINTI NIEKO
  // draft ateina su regions, kuris turi būti pakeistas į regbits

  const userRole = req.user.role;
  const ttype = req.body.ttype;

  // jeigu ne adm, dev, superadm - negali updateinti
  if (!["adm", "superadm", "dev"].includes(userRole)) {
    return res.status(404).send({ msg: "neturi teisės keisti" });
  }

  const coll = COLLECTIONS.find(c => c.name === ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });

  // jeigu ne superadm, dev - negali updateinti bendrų
  if (!["superadm", "dev"].includes(userRole) && !coll.hasRegion) {
    return res
      .status(404)
      .send({
        msg:
          "čia yra bendri duomenys, o tu gali keisti išimtinai tik savo regiono duomenis"
      });
  }

  let draft = req.body.draft;

  let filter = "id = @id";

  // Nustatomi regbits, jeigu reikia (jeigu coll.hasRegion):
  if (userRole === "adm") {
    // Adm'ui keisti tų, kurie neturi region, neleidžiama (aukščiau)
    // todėl, jeigu role === adm, tai būtinai coll.hasRegion.
    // Adm filtras turi leisti updateinti tik tą,
    // kurio thing.regbits === req.user.regbit;
    // Jeigu kažkas perduodama per draft.regions, tuo nepasitikima ir
    // į tai nekreipiama dėmesio (vėliau ištrinama).
    // 1. apsaugo, kad nelįstų prie svetimo regiono things
    filter += " AND regbits = @regbits";
    // 2. draft.regbits pakeičiamas, kad neapgautų ir kad perduotų sql parametrą
    draft.regbits = req.user.regbit;
  } else if (["superadm", "dev"].includes(userRole) && coll.hasRegion) {
    // per draft.regions perduodama regionų id array
    // jis paverčiamas regbits integer
    draft.regbits = draft.regions.reduce(
      (acc, regionId) => acc | REGIONS[regionId].bit,
      0
    );
  }
  delete draft.regions;

  const stmtText = SQLStatements.update(draft, ttype, filter);
  try {
    const stmt = db.prepare(stmtText);
    const info = stmt.run(draft);
    //const info = stmt.run(draft);
    return res.status(200).json({ info, draft });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// @route PUT api/sqlite/things/insert
// @desc Create thing
// @access Public
router.put("/create", (req, res) => {
  // INSERTINAMA TURI BŪTI PRIKLAUSOMAI NUO USERROLE:
  // JEIGU ADMINAS, TAI GALI INSERTINTI VIEN TIK SAVO REGIONUI,
  // JEIGU SUPERADMINAS, TAI GALI INSERTINTI BET KURIEMS REGIONAMS
  // JEIGU KITOS ROLĖS, TAI NEGALI INSERTINTI NIEKO
  const userRole = req.user.role;
  const ttype = req.body.ttype;

  // jeigu ne adm, dev, superadm - negali updateinti
  if (!["adm", "superadm", "dev"].includes(userRole)) {
    return res.status(404).send({ msg: "neturi teisės kurti" });
  }

  const coll = COLLECTIONS.find(c => c.name === ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });

  // jeigu ne superadm, dev - negali updateinti bendrų
  if (!["superadm", "dev"].includes(userRole) && !coll.hasRegion) {
    return res
      .status(404)
      .send({
        msg:
          "Čia bendri duomenys, o tau leidžiama kurti duomenis tiktai savo regionui. Kreipkis į superadminą. Soriukas :)"
      });
  }

  let draft = req.body.draft;

  if (coll.autoId) {
    delete draft.id;
  } else {
    // check if draft has id property
    if (!draft.id) {
      return res.status(400).send({ msg: "id is required" });
    }

    // check if id is unique
    try {
      const stmtCount = db.prepare(
        `SELECT COUNT(*) AS count FROM ${coll.name} WHERE id = ?`
      );
      const result = stmtCount.get(draft.id);
      // console.log("result", result);
      if (result.count > 0)
        return res.status(400).send({ msg: "id must be unique" });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }

  // Nustatomi regbits, jeigu reikia (jeigu coll.hasRegion):
  if (userRole === "adm") {
    // Adm'ui kurti tų, kurie neturi region, neleidžiama (aukščiau)
    // todėl, jeigu role === adm, tai būtinai coll.hasRegion.
    draft.regbits = req.user.regbit;
  } else if (["superadm", "dev"].includes(userRole) && coll.hasRegion) {
    // per draft.regions perduodama regionų id array
    // jis paverčiamas regbits integer
    draft.regbits = draft.regions.reduce(
      (acc, regionId) => acc | REGIONS[regionId].bit,
      0
    );
  }
  delete draft.regions;

  // insert new item
  const stmtText = SQLStatements.insert(draft, req.body.ttype);
  // console.log("text", stmtText);
  // console.log("draft", draft);
  try {
    const stmt = db.prepare(stmtText);
    const info = stmt.run(draft);
    if (info.changes === 1) {
      if (coll.autoId) draft.id = info.lastInsertRowid;
      return res.status(200).json(draft); // SUCCESS
    }
    return res.status(500).send({ msg: "not inserted" });
  } catch (err) {
    console.error("error", err);
    return res.status(500).send(err);
  }
});

// @route DELETE api/sqlite/things/delete
// @desc Delete thing
// @access Public
router.delete("/delete", (req, res) => {
  // TRINAMA TURI BŪTI PRIKLAUSOMAI NUO USERROLE:
  // JEIGU ADMINAS, TAI GALI TRINTI VIEN TIK SAVO REGIONUI,
  // JEIGU SUPERADMINAS, TAI GALI TRINTI BET KURĮ
  // JEIGU KITOS ROLĖS, TAI NEGALI TRINTI NIEKO
  const userRole = req.user.role;
  const ttype = req.body.ttype;

  // jeigu ne adm, dev, superadm - negali updateinti
  if (!["adm", "superadm", "dev"].includes(userRole)) {
    return res.status(404).send({ msg: "tu neturi teisės trinti" });
  }

  const coll = COLLECTIONS.find(c => c.name === ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });

  // jeigu ne superadm, dev - negali trinti bendrų
  if (!["superadm", "dev"].includes(userRole) && !coll.hasRegion) {
    return res
      .status(404)
      .send({
        msg:
          "Čia bendri duomenys, o tau leidžiama trinti tik išskirtinai savo regiono duomenis. Kreipkis į superadminą. Soriukas :)"
      });
  }

  let filter = "id = ?";
  // Nustatomi regbits, jeigu reikia (jeigu coll.hasRegion):
  if (userRole === "adm") {
    // Adm'ui keisti tų, kurie neturi region, neleidžiama (aukščiau)
    // todėl, jeigu role === adm, tai būtinai coll.hasRegion.
    // Adm filtras turi leisti trinti tik tą,
    // kurio thing.regbits === req.user.regbit;
    filter += " AND regbits = @regbits";
  }

  const stmtText = SQLStatements.delete(req.body.ttype, filter);
  // console.log("text, id", stmtText, req.body.id);

  try {
    const stmt = db.prepare(stmtText);
    const info = stmt.run(req.body.id, { regbits: req.user.regbit });
    return res.status(200).send(info);
  } catch (err) {
    console.error(err);    
    return res.status(500).send({ ...err, msg: "bbz... :/" });
  }
});

module.exports = router;
