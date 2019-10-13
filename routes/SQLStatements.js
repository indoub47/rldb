//const modelProvider = require("../models/modelProvider");
const collections = require("../config/collections");

const filters1 = {
  update: {
    main: "id = @id AND regbit = @regbit",
    journal: "jid = @jid AND mainid = @mainid"
  }
};

const filters = {
  update: {
    main: keyCount => `id = $${keyCount + 1} AND regbit = $${keyCount + 2}`,
    journal: keyCount => `jid = $${keyCount + 1} AND mainid = $${keyCount + 2}`
  }
};

const exclude = {
  update: {
    main: ["id", "regbit"],
    journal: ["jid", "mainid"]
  },
  insert: {
    main: ["id"],
    journal: ["jid"]
  }
};

// eksportuoja funkciją, kuriai padavus objektą,
// ji pagamina to objekto INSERT SQL statement tekstą:
// textFactory = INSERT_stmtTextFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.INSERT_stmtTextFactory_SQLITE = (itype, itemPart) => {
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.insert[itemPart];
  return obj => {
    const keys = Object.keys(obj).filter(key => !excludeFields.includes(key));

    return `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${keys
      .map(key => "@" + key)
      .join(", ")})`;
  };
};

// eksportuoja funkciją, kuriai padavus objektą,
// ji pagamina to objekto UPDATE SQL statement tekstą:
// textFactory = UPDATE_stmtTextFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.UPDATE_stmtTextFactory_SQLITE = (itype, itemPart) => {
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.update[itemPart];
  const filter = filters.update[itemPart];

  return obj => {
    const updateText = `UPDATE ${tableName} SET ${Object.keys(obj)
      .filter(key => !excludeFields.includes(key))
      .map(key => `${key} = @${key}`)
      .join(", ")}`;
    if (filter) return updateText + ` WHERE ${filter}`;
    return updateText;
  };
};

// eksportuoja funkciją, kuriai padavus objektą,
// ji pagamina to objekto INSERT SQL statement tekstą:
// textFactory = INSERT_stmtFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.INSERT_stmtFactory = (itype, itemPart) => {
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.insert[itemPart];
  return obj => {
    //console.log("..... excludeFields", excludeFields);
    //console.log("..... obj", obj);
    //console.log("..... obj.keys", Object.keys(obj));
    const keys = Object.keys(obj).filter(key => !excludeFields.includes(key));
    // console.log("..... filtered keys", keys);
    const values = keys.map(key => obj[key]);
    //console.log("..... values", values);
    const text = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${keys
      .map((key, index) => `$${index + 1}`)
      .join(", ")}) RETURNING *`;
    //console.log("..... text", text);
    return {text, values};
  };
};



// eksportuoja funkciją, kuriai padavus objektą,
// ji pagamina to objekto UPDATE SQL statement tekstą:
// textFactory = UPDATE_stmtTextFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.UPDATE_stmtFactory = (itype, itemPart) => {
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.update[itemPart];
  const filterFunc = filters.update[itemPart];

  return obj => {
    const keys = Object.keys(obj).filter(key => !excludeFields.includes(key));
    const values = keys.map(key => obj[key]);
    const text = `UPDATE ${tableName} SET ${keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ")} WHERE ${filterFunc(keys.length)} RETURNING *`;
    return {text, values};
  };
};

// eksportuoja funkciją, kuri
// pagamina objekto main dalies DELETE SQL statement tekstą:
// txtStmt = DELETEMAIN_stmtText(itype);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(mainData);
// kur mainData turi id, regbit, v
module.exports.DELETE_MAIN_stmtText_SQLITE = itype => {
  const tableName = collections[itype].tables.main.name;
  return `DELETE FROM ${tableName} WHERE id = @id AND regbit = @regbit AND v = @v`;
};

// eksportuoja funkciją, kuri
// pagamina objekto main dalies DELETE SQL statement tekstą:
// txtStmt = DELETEMAIN_stmtText(itype);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(mainData);
// kur mainData turi id, regbit, v
module.exports.DELETE_MAIN_stmt = itype => {
  const tableName = collections[itype].tables.main.name;
  return `DELETE FROM ${tableName} WHERE id = $1 AND regbit = $2 AND v = $3`;
};

// eksportuoja funkciją, kuri
// pagamina updateinamo item kai kurių journal DELETE SQL statement tekstą:
// txtStmt = DELETE_SOME_JOURNAL_stmtText(itype, journal.delete);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(main_id, journal.delete);
module.exports.DELETE_SOME_JOURNAL_stmtText_SQLITE = (itype, journal_delete) => {
  const tableName = collections[itype].tables.journal.name;
  return `DELETE FROM ${tableName} WHERE mainid = ? AND jid IN (${journal_delete
    .map(j => "?")
    .join(", ")})`;
};

// eksportuoja funkciją, kuri
// pagamina updateinamo item kai kurių journal DELETE SQL statement tekstą:
// txtStmt = DELETE_SOME_JOURNAL_stmtText(itype, journal.delete);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(main_id, journal.delete);
module.exports.DELETE_SOME_JOURNAL_stmt = (itype, journal_delete, mainId) => {
  const tableName = collections[itype].tables.journal.name;
  const text = `DELETE FROM ${tableName} WHERE mainid = $1 AND jid IN (${journal_delete
    .map((j, index) => `$${index + 2}`)
    .join(", ")})`;
  const  values = [mainId, ...journal_delete];
  return {text, values};
};

// eksportuoja prepared statement, kuris
// naikina item visą journal
// Kad tą įvykdyti, reikia stmt.run(main_id);
module.exports.DELETE_WHOLE_JOURNAL_stmt = itype => {
  const tableName = collections[itype].tables.journal.name;
  return `DELETE FROM ${tableName} WHERE mainid = $1`;
};

module.exports.SELECT_JOURNAL_COUNT_stmt = itype => {
  const tableName = collections[itype].tables.journal.name;
  return `SELECT COUNT(*) AS count FROM ${tableName} WHERE mainid = $1`;
}

// eksportuoja prepared statement, kuris
// naikina item visą journal
// Kad tą įvykdyti, reikia stmt.run(main_id);
module.exports.DELETE_WHOLE_JOURNAL_stmt_SQLITE = (itype, db) => {
  const tableName = collections[itype].tables.journal.name;
  return db.prepare(`DELETE FROM ${tableName} WHERE mainid = ?`);
};

module.exports.simpleUpdateStmt_SQLITE = (obj, tableName, excludeFields) => {
  const exFields = excludeFields || [];
  return `UPDATE ${tableName} SET ${Object.keys(obj)
    .filter(key => !exFields.includes(key))
    .map(key => `${key}=@${key}`)
    .join(", ")}`;
};

module.exports.simpleUpdateStmt = (obj, tableName, excludeFields) => {
  const exFields = excludeFields || [];
  const keys = Object.keys(obj).filter(key => !exFields.includes(key));
  const values = keys.map(key => obj[key]);
  const text = `UPDATE ${tableName} SET ${keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ")}`;
  return { text, values };
};

module.exports.simpleDeleteStmt = (tableName, filter) => {
  return `DELETE FROM ${tableName} WHERE ${filter}`;
};

module.exports.simpleInsertStmt = (draft, tableName, excludeFields) => {
  const exFields = excludeFields || [];
  const keys = Object.keys(draft).filter(key => !exFields.includes(key));
  const values = keys.map(key => draft[key]);
  const text = `INSERT INTO ${tableName} (${keys.join(
    ", "
  )}) VALUES (${values
    .map((val, index) => "$" + (index + 1))
    .join(", ")}) RETURNING *`;
  return { text, values };
};

module.exports.simpleInsertStmt_SQLITE = (tableName, draft, excludeFields) => {
  const exFields = excludeFields || [];
  const keys = Object.keys(draft).filter(key => !exFields.includes(key));

  return `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${keys
    .map(key => "@" + key)
    .join(", ")})`;
};

module.exports.DELETE_FROM_SUPPLIED_stmt = db =>
  db.prepare("DELETE FROM supplied WHERE regbit = ? AND itype = ?");

module.exports.INSERT_INTO_UNAPPROVED_stmt = db =>
  db.prepare(
    "INSERT INTO unapproved (input, itype, oper) VALUES (@input, @itype, @oper)"
  );

module.exports.SHIFT_MAIN_V_stmt = (itype, db) => {
  const tableName = collections[itype].tables.main.name;
  return db.prepare(`UPDATE ${tableName} SET v = v + 1 WHERE id = ?`);
};

module.exports.SEARCH_ITEMS_BY_LOCATION_stmt = (query, regbit, collection) => {
  const tableName = collection.tables.viewActiveLastJ.name;
  const notPanaikinta = collection.notPanaikinta;
  const LOCATION_KEYS = [
    "linija",
    "kelias",
    "km",
    "pk",
    "m",
    "siule",
    "iesmas",
    "nr",
    "stotis"
  ];
  const keys = Object.keys(query).filter(
    key =>
      LOCATION_KEYS.includes(key) && query[key] != null && query[key] !== ""
  );
  if (keys.length === 0)
    return {error: {status: 400, msg: "no location"} };
  const values = keys.map(key => query[key]);
  const locationFilter = keys
    .map((key, index) => `${key} = $${index + 2}`)
    .join(" AND ");
  const text = `SELECT * FROM ${tableName} WHERE regbit = $1 AND ${locationFilter} AND ${notPanaikinta}`;
  return { text, values: [regbit, ...values] };
};

module.exports.DELETE_FROM_SUPPLIED_BY_ID_stmt = db => {
  return db.prepare("DELETE FROM supplied WHERE id = ?");
};

module.exports.INSERT_INTO_UNAPPROVED_stmt = db => {
  return db.prepare(
    "INSERT INTO unapproved (oper, itype, input) VALUES (?, ?, ?)"
  );
};

module.exports.QUERY_IF_ITEM_EXISTS_stmtFactory = coll =>
  `SELECT * FROM ${coll.tables.main.name} WHERE id = $1 AND regbit = $2`;

module.exports.QUERY_IF_ITEM_EXISTS_stmtFactory = (db, coll) => {
  return db.prepare(
    `SELECT * FROM ${coll.tables.main.name} WHERE id = ? AND regbit = ?`
  );
};

module.exports.QUERY_IF_SAME_LOCATION_stmtFactory = (db, coll, action) => {
  const samePlaceFilter = `${coll.samePlace.filter[action]} AND ${coll.notPanaikinta} AND  ${coll.samePlace.query}`;
  const spStmtText = "SELECT * FROM " + coll.tables.main.name + samePlaceFilter;
  //console.log("sameLocation stmt", spStmtText);

  return db.prepare(spStmtText);
};
