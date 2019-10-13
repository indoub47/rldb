function checkVersionMatch(foundV, mainV) {
  return new Promise((resolve, reject) => {
    if (foundV !== mainV) {
      reject({
        status: 409,
        reason: "bad criteria",
        msg: `Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
      });
    } else resolve();
  });
}

module.exports = checkVersionMatch;