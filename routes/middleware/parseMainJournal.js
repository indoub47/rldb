

module.exports = (item, emptyItem) => {
  let errors = [];
  try {
    item.main = JSON.parse(item.main);
  } catch (err) {
    //console.log("main error", err);
    errors.push("wrong main string: " + item.main.trim());
    item.main = emptyItem.main;
  }
  try {
    item.journal = JSON.parse(item.journal);
  } catch (err) {
    //console.log("journal error", err);
    errors.push("wrong journal string: " + item.journal.trim());
    item.journal = emptyItem.journal;
  }
  if (errors.length > 0) {
    item.validation = {reason: "JSON.parse", errors}
  }
}

// module.exports = item => {
//   return new Promise((resolve, reject) => {
//     let result = {};
//     let errors = [];

//     try {
//       result.main = JSON.parse(item.main); 
//     } catch (err) {
//       errors.push(err);
//     }

//     try {
//       result.journal = JSON.parse(item.journal);      
//     } catch (err) {
//       errors.push(err);
//     }

//     if (errors.length > 0) {
//       reject({
//         status: "parse error"
//       });
//     } else {
//       resolve(result);
//     }
//   });
// }