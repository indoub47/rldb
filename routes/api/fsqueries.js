const express = require("express");
const router = express.Router();
const passport = require("passport");
const SQLStatements = require("../SQLStatements");

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const tableName = "fsqueries";

const nameIsNotUnique = (name, email, db) => {
  const stmtText = `SELECT COUNT(*) AS count FROM ${tableName} WHERE email = ? AND name = ?`;
  const stmt = db.prepare(stmtText);
  return stmt.get(email, name).count > 0;
};

const validate = (draft, exclude) => {
  let result = [];
  if (!exclude.includes("id")) {
    if (draft.id == null || !(Number.isInteger(draft.id) && draft.id > 0)) {
      result.push({key: "id", msg: "privalomas ir turi būti teigiamas sveikasis skaičius"});
    }
  }
  if (!exclude.includes("name")) {
    if (draft.name == null || draft.name.length < 1 || draft.name.length > 50) {
      result.push({key: "name", msg: "privalomas, ilgis turi būti nuo 1 iki 50 simbolių"});
    }
  }
  if (!exclude.includes("filter")) {
    if (draft.filter != null && draft.filter.length > 500) {
      result.push({key: "filter", msg: "ilgis turi būti iki 500 simbolių"});
    }
  }
  if (!exclude.includes("sort")) {
    if (draft.sort != null && draft.sort.length > 500) {
      result.push({key: "sort", msg: "ilgis turi būti iki 500 simbolių"});
    }
  }
  if (!exclude.includes("itype")) {
    if (draft.itype == null || !["defect", "welding"].includes(draft.itype)) {
      result.push({key: "itype", msg: "privalomas ir turi būti iš patvirtinto sąrašo"}); 
    }
  }
  if (!exclude.includes("email")) {
    if (
      draft.email == null ||
      draft.email.length < 5 ||
      draft.name.length > 255
    ) {
      result.push({key: "email", msg: "privalomas ir ilgis turi būti 5-25 simbolių"});
    }
  }
  return result;
};

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/fsquery/fetch
// @desc Get fsqueries for particular itype and email
// @params itype string
// @access Public
router.get("/fetch", (req, res) => {
  const email = req.user.email;
  const itype = req.query.itype;
  const stmtText = `SELECT * FROM ${tableName} WHERE email = ? AND itype = ?`;
  try {
    const stmt = db.prepare(stmtText);
    const fsqueries = stmt.all(email, itype);
    return res.status(200).json(fsqueries);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// @route DELETE api/fsquery/delete
// @desc Delete fsquery
// @params id string
// @access Public
router.delete("/delete", (req, res) => {
  const email = req.user.email;
  const id = req.query.id;
  const stmtText = SQLStatements.simpleDeleteStmt(tableName, 'email = ? AND id = ?');
  // email - kad apsaugoti, kad galėtų ištrinti tik savus
  try {
    const info = db.prepare(stmtText).run(email, id);
    return res.status(200).json({ ...info, id });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// @route POST api/fsquery/update
// @desc Delete fsquery
// @body draft object
// @access Public
router.post("/update", (req, res) => {
  let draft = req.body;
  draft.email = req.user.email;

  const validation = validate(draft, ["email"]);
  if (validation.length) {
    return res.status(400).send({errors: validation});
  } 


  try {
    // check if name is unique
    const stmtUniqueText = `SELECT COUNT(*) AS count FROM ${tableName} WHERE email = ? AND name = ? AND itype = ? AND id <> ?`;
    const result = db.prepare(stmtUniqueText).get(draft.email, draft.name, draft.itype, draft.id);
    if (result.count !== 0) return res.status(400).send({ msg: "name must be unique" });

    // perform update
    const filter = 'email=@email AND id=@id AND itype=@itype';
    const stmtText = `${SQLStatements.simpleUpdateStmt(draft, tableName, ["id", "email", "itype"])} WHERE ${filter}`;
    const info = db.prepare(stmtText).run(draft);
    return res.status(200).json(draft);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// @route PUT api/fsquery/insert
// @desc Insert fsquery
// @body draft object
// @access Public
router.put("/insert", (req, res) => {
  let draft = req.body;
  draft.email = req.user.email;
  delete draft.id;
  // console.log("mark1");
  const validation = validate(draft, ["email", "id"]);
  if (validation.length) {
    return res.status(400).send({errors: validation});
  }
  // console.log("mark2");
  
  try {
    // check if name is unique
    const stmtUniqueText = `SELECT COUNT(*) AS count FROM ${tableName} WHERE email = ? AND name = ? AND itype = ?`;
    const stmtUnique = db.prepare(stmtUniqueText);
    const unique =
      stmtUnique.get(draft.email, draft.name, draft.itype).count === 0;
    if (!unique) return res.status(400).send({ msg: "name must be unique" });
    
    // perform insert
    const stmtText = SQLStatements.simpleInsertStmt(tableName, draft);    
    // console.log("insert stmt", stmtText);
    const info = db.prepare(stmtText).run(draft);
    return res.status(200).json({ ...draft, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);    
    return res.status(500).send(err);
  }
});

module.exports = router;
