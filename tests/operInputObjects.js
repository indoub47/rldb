module.exports = {
  create: {
    badDraft: {
      badMain: {
        main: {
          id: -43606, regbit: 8, linija: "23", 
          kelias: "7", km: "xx", pk: 5, m: 36, siule: "9", 
          meistrija: 11, kkateg: 5, btipas: "60E1", 
          bgamykl: "ENS", bmetai: "xxx", "v": 2
        },
        journal: {
          data: "2019-07-21", oper: 422, dtermin: "2019-07-24", 
          apar: 822, kodas: "27.2", dh: 5, dl: 10, pavoj: "DP", 
          note: "mėginimas7"
        }
      },
      badJournal: {
        main: {
          id: -43606, regbit: 8, linija: "23", 
          kelias: "7", km: 15, pk: 5, m: 36, siule: "9", 
          meistrija: 11, kkateg: 5, btipas: "60E1", 
          bgamykl: "ENS", bmetai: 2000, "v": 2
        },
        journal: {
          data: "2019-07", oper: 422, dtermin: "2019-07-24", 
          kodas: "27.2", dh: "cv", dl: 10, pavoj: "DP", note: "mėginimas7"
        }
      },
      badMainJournal: {
        main: {
          id: -43606, regbit: 8, linija: "23", 
          kelias: "7", km: "xx", pk: 5, m: 36, siule: "9", 
          meistrija: 11, kkateg: 5, btipas: "60E1", 
          bgamykl: "ENS", bmetai: "xxx", "v": 2
        },
        journal: {
          data: "1019-07", oper: 422, dtermin: "89-07-24", 
          kodas: "27.2", dh: "cv", dl: 10, pavoj: "DP", note: "mėginimas7"
        }
      }
    },
    samePlace: {
      main: {
        id: -10495, regbit: 8, linija: "1", kelias: "1", km: 339, 
        pk: 2, m: 9, siule: "0", meistrija: 5, kkateg: 1, btipas: "R65",
        bgamykl: "T", bmetai: 2010, v: 5
      },
      journal: {
        data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
        dl: 5, pavoj: "D1", dtermin: "2017-01-27"
      }
    },
    noError: {
      main: {
        id: -10495, regbit: 8, linija: "1", kelias: "2", km: 331, 
        pk: 2, m: 9, siule: "0", meistrija: 5, kkateg: 1, btipas: "R65",
        bgamykl: "T", bmetai: 2010, v: 5
      },
      journal: {
        data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
        dl: 5, pavoj: "D1", dtermin: "2017-01-27"
      }
    }
  },

  modify: {    
    badDraft: {
      badMainButOk: {
        main: {
          id: 20, regbit: 8, linija: "23", 
          kelias: "1", km: "xx", pk: 5, m: 36, siule: "9", 
          meistrija: 11, kkateg: 5, btipas: "60E1", 
          bgamykl: "ENS", bmetai: "xxx", "v": 0
        },
        journal: {
          data: "2019-07-21", oper: 422, dtermin: "2019-07-24", 
          apar: 822, kodas: "27.2", dh: 5, dl: 10, pavoj: "DP", 
          note: "mėginimas7"
        }
      },
      badJournal: {
        main: {
          id: 20, regbit: 8, linija: "23", 
          kelias: "1", km: 1, pk: 5, m: 50, siule: "0", 
          meistrija: 8, kkateg: 2, btipas: "UIC60", 
          bgamykl: "BS", bmetai: 2000, "v": 0
        },
        journal: {
          data: "2019-07", oper: 422, dtermin: "2019-07-24", 
          kodas: "27.2", dh: "cv", dl: 10, pavoj: "DP", note: "mėginimas7"
        }
      },
      badMainJournal: {
        main: {
          id: 20, regbit: 8, linija: "23", 
          kelias: "1", km: "xx", pk: 5, m: 36, siule: "9", 
          meistrija: 11, kkateg: 5, btipas: "60E1", 
          bgamykl: "ENS", bmetai: "xxx", "v": 2
        },
        journal: {
          data: "1019-07", oper: 422, dtermin: "89-07-24", 
          kodas: "27.2", dh: "cv", dl: 10, pavoj: "DP", note: "mėginimas7"
        }
      }
    },
    stillExists: {
      nonExists: {
        main: {
          id: 15009, regbit: 8, linija: "1", kelias: "2", km: 331, 
          pk: 2, m: 9, siule: "0", meistrija: 5, kkateg: 1, btipas: "R65",
          bgamykl: "T", bmetai: 2010, v: 5
        },
        journal: {
          data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
          dl: 5, pavoj: "D1", dtermin: "2017-01-27"
        }
      },
      differentRegion: {
        main: {
          id: 30020, regbit: 8, linija: "9", kelias: "1", km: 7, 
          pk: 1, m: 6, siule: "9", meistrija: 4, kkateg: 1, btipas: "R65",
          bgamykl: "T", bmetai: 2010, v: 0
        },
        journal: {
          data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
          dl: 5, pavoj: "D1", dtermin: "2017-01-27"
        }
      }
    },
    badVersion: {
      veq0: {
        main: {
          id: 15001, regbit: 8, linija: "17", kelias: "1", km: 103, 
          pk: 3, m: 62, siule: "9", meistrija: 14, kkateg: 2, btipas: "R65",
          bgamykl: "T", bmetai: 1989, v: 1
        },
        journal: {
          data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
          dl: 5, pavoj: "D1", dtermin: "2017-01-27"
        }
      },
      vgt0: {
        main: {
          id: 10570, regbit: 8, linija: "1", kelias: "1", km: 347, 
          pk: 5, m: 5, siule: "0", meistrija: 5, kkateg: 1, btipas: "R65",
          bgamykl: "T", bmetai: 2006, v: 1
        },
        journal: {
          data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
          dl: 5, pavoj: "D1", dtermin: "2017-01-27"
        }
      }
    },
    noError: {
      main: {
        id: 24560, regbit: 8, linija: "46", kelias: "8", km: 6, 
        pk: 0, m: 6, siule: "9", meistrija: 1, kkateg: 3, btipas: "R65",
        bgamykl: "K", bmetai: 2015, v: 1
      },
      journal: {
        data: "2017-01-12", oper: 427, apar: 828, kodas: "98.2", dh: 60, 
        dl: 5, pavoj: "D1", dtermin: "2017-01-27"
      }
    }
  }
}