function checkStillExists(db, tableName, id, regbit) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = $1 AND regbit = $2`, [id, regbit])
      .then(succ => {
        if (succ.rowCount === 0) {
          reject({
            status: 404,
            reason: "bad criteria",
            msg: `Operacija neatlikta, nes įrašas ištrintas iš db`
          });
        } else resolve(succ.rows[0]);
      })
      .catch(err => reject(err));
  });
}

module.exports = checkStillExists;
