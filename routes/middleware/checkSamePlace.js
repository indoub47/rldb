module.exports = (db, config, action, main, regbit) =>
  // patikrinti ar toje pačioje vietoje nėra įrašo
  // jeigu įrašas yra, išmeta klaidą
  // o jeigu įrašo nėra, grąžina false
  new Promise((resolve, reject) => {
    const filter = `${config.samePlaceFilter[action].text} AND ${config.notPanaikinta}`;
    const spStmtText = `SELECT * FROM ${config.tables.main.name} ${filter}`;
    const spValues = [
      ...config.samePlaceFilter[action].mainKeys.map(k => main[k]),
      regbit
    ];
    db.query(spStmtText, spValues)
      .then(succ => {
        if (succ.rowCount > 0) {
          reject({
            status: 400,
            reason: "same place",
            msg: `Šitoje vietoje jau yra įrašas, jo id: ${succ.rows[0].id}`
          });
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
