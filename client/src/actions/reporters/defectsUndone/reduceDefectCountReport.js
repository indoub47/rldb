export default function reduceDefectCountReport(report) {
  let things = {meistrija: [], kkateg: [], pavoj: []};
  let counts = [];

  for (var m = 0; m < report.length; m++) {
    let currentMKks = []; // kkategs of current meistrija
    for (var kk = 0; kk < report[m].kkateg.length; kk++) {
      let currentKkPavojs = []; // pavojs of current kkateg
      for (var p = 0; p < report[m].kkateg[kk].pavoj.length; p++) {
        if (report[m].kkateg[kk].pavoj[p].count > 0) {
          currentKkPavojs.push({...report[m].kkateg[kk].pavoj[p]});
        }
      }
      if (currentKkPavojs.length > 0) {
        currentMKks.push({...report[m].kkateg[kk], pavoj: currentKkPavojs});
      }
    }
    if (currentMKks.length > 0) {
      counts.push({...report[m], kkateg: currentMKks});
    }
  }

  return counts;
}