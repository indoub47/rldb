module.exports = (foundV, mainV) =>
  new Promise((resolve, reject) => {
    if (foundV !== mainV) {
      reject({
        status: 409,
        reason: "wrong version",
        msg: `Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
      });
    } else resolve();
  });
