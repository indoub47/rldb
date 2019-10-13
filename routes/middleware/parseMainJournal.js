module.exports = item => {
  let errors = [];
  try {
    item.main = JSON.parse(item.main);
  } catch (err) {
    errors.push(err);
  }
  try {
    item.journal = JSON.parse(item.journal);
  } catch (err) {
    errors.push(err);
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