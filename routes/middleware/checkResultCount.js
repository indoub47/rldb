// tikrina ar operacijos rezultato eilučių skaičius sutampa su operacijos argumento eilučių skaičiumi. Jeigu nesutampa, grąžina rejected Promise su klaida, o jeigu sutampa grąžina resolved Promise su pačiomis operacijos rezultato eilutėmis.

module.exports.multi = (result, inputCount) =>
  new Promise((resolve, reject) => {
    const resultCount = result
      .map(s => s.rowCount)
      .reduce((total, curr) => total + curr, 0);

    if (resultCount !== inputCount) {
      reject({
        status: 500,
        reason: "wrong count",
        msg: "Serverio klaida"
      });
    } else {
      resolve(result);
    }
  });

module.exports.single = (result, inputCount = 1) =>
  new Promise((resolve, reject) => {
    if (result.rowCount !== inputCount) {
      reject({
        status: 500,
        reason: "wrong count",
        msg: `Serverio klaida`
      });
    } else {
      resolve(result);
    }
  });
