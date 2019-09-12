const express = require("express");
const router = express.Router();
const passport = require("passport");
const SQLStatements = require("../SQLStatements");

const { Pool } = require("pg");
const pool = new Pool();

const tableName = "fsqueries";

// const nameIsNotUnique = (name, email) => {
//   const text = `SELECT COUNT(*) AS count FROM ${tableName} WHERE email = $1 AND name = $2`;
//   pool.query(text, [email, name])
//     .then(succ => succ.rows[0].count > 0)
//     .catch(err => throw err);
// };

const nameIsNotUnique_sqlite = (name, email, db) => {
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
  const text = `SELECT * FROM ${tableName} WHERE email = $1 AND itype = $2`;
  pool.query(text, [req.user.email, req.query.itype])
    .then(succ => res.status(200).json(succ.rows))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

// @route DELETE api/fsquery/delete
// @desc Delete fsquery
// @params id string
// @access Public
router.delete("/delete", (req, res) => {
  const text = `DELETE FROM ${tableName} WHERE email = $1 AND id = $2`;
  pool.query(text, [req.user.email, req.query.id])
    .then(succ => res.status(200).json({deleted: succ.rows[0], id: req.query.id}))
    .catch(err =>  {
      console.error(err);
      return res.status(500).send(err);
    });
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

  // check if name is unique
  const txtUnique = `SELECT COUNT(*)::integer AS count FROM ${tableName} WHERE email = $1 AND name = $2 AND itype = $3 AND id <> $4`;
  pool.query(txtUnique, [draft.email, draft.name, draft.itype, draft.id])
    .then(succ => {
      if (succ.rows[0].count !== 0) {
        throw { status: 400, message: "name must be unique" };
      }
      // prepare update text and values
      const updateStmt = SQLStatements.simpleUpdateStmt(draft, tableName, ['email', 'id', 'itype']);
      let last = updateStmt.values.length;
      const filter = ` WHERE email = $${++last} AND id = $${++last} AND itype = $${++last}`;
      const updateText = updateStmt.text + filter + ' RETURNING *';
      const updateValues = [...updateStmt.values, draft.email, draft.id, draft.itype];
      console.log("updateText", updateText);
      console.log("updateValues", updateValues);
      // attempt to perform update
      return pool.query(updateText, updateValues);
    })
    .then(succ => {
      const updated = succ.rows[0];
      res.status(200).json(updated);
    })
    .catch(err => {
      console.error(err);
      if (err.status) {
        res.status(err.status).json(err);
      } else {
        res.status(500).json(err);
      }
    });
});

// @route PUT api/fsquery/insert
// @desc Insert fsquery
// @body draft object
// @access Public
router.put("/insert", (req, res) => {
  let draft = req.body;
  draft.email = req.user.email;
  delete draft.id;
  const validation = validate(draft, ["email", "id"]);
  if (validation.length) {
    return res.status(400).send({errors: validation});
  }
  
  // check if name is unique
  const txtUnique = `SELECT COUNT(*)::integer AS count FROM ${tableName} WHERE email = $1 AND name = $2 AND itype = $3`;
  pool.query(txtUnique, [draft.email, draft.name, draft.itype])
    .then(succ => {
      if (succ.rows[0].count !== 0) {
        throw { status: 400, message: "name must be unique" };
      }
      const insertStmt = SQLStatements.simpleInsertStmt(draft, tableName);
      // console.log("insertText", insertStmt.text);
      // console.log("insertValues", insertStmt.values);
      return pool.query(insertStmt);
    })
    .then(succ => res.status(200).json(succ.rows[0]))
    .catch(err => {
      console.error(err);
      if (err.status) {
        res.status(err.status).json(err);
      } else {
        res.status(500).json(err);
      }
    });
});

module.exports = router;
