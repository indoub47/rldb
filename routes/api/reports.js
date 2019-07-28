const express = require("express");
const router = express.Router();
const passport = require("passport");
const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;
const addToDate = require("../../utilities/date").addToDate;

const MongoClient = require("mongodb").MongoClient;

const getDate = queryDate =>
  queryDate || new Date().toISOString().split("T")[0];
const emptyDateValues = [null, 0, "", false, "0000-00-00"];

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/report/defects-undone
// @desc Get all defefects which are still on the road
// @access Public
router.get("/defects-undone", (req, res) => {
  // connect mongo
  MongoClient.connect(dbUri, { useNewUrlParser: true })
    .then(client => {
      return client.db(dbName);
    })
    .then(db => {
      // console.log("req.query", req.query);
      const byDate = getDate(req.query.byDate);

      let defectsFilter = {
        region: req.user.region,
        daptik: { $lte: byDate },
        $or: [
          { panaikinta: { $in: emptyDateValues } },
          { panaikinta: { $gt: byDate } }
        ]
      };

      if (req.query.whichDefects === "overdued") {
        defectsFilter.$and = [
          { dtermin: { $nin: emptyDateValues } },
          { dtermin: { $lt: byDate } }
        ];
      }

      // console.log("defectsFilter: ", defectsFilter);

      const thingsFilter = {
        $or: [{ region: req.user.region }, { region: { $exists: false } }]
      };

      return Promise.all([
        db.collection("meistrija").find(thingsFilter),
        db.collection("kkateg").find(thingsFilter),
        db.collection("pavoj").find(thingsFilter),
        db.collection("defects").find(defectsFilter)
      ]);
    })
    .then(cursors => Promise.all(cursors.map(c => c.toArray())))
    .then(arrays =>
      res.status(200).send({
        things: {
          meistrija: arrays[0],
          kkateg: arrays[1],
          pavoj: arrays[2]
        },
        data: arrays[3]
      })
    )
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

// @route GET api/report/defects-undone-count
// @desc counts of all defefects which are still on the road, grouped by meistrija, kkateg, pavoj
// @access Public
router.get("/defects-undone-count", (req, res) => {
  // connect mongo
  MongoClient.connect(dbUri, { useNewUrlParser: true })
    .then(client => client.db(dbName))
    .then(db => {
      // thing  filter
      const thingsFilter = {
        $or: [{ region: req.user.region }, { region: { $exists: false } }]
      };

      // defect filter
      const byDate = getDate(req.query.byDate);
      let defectsFilter = {
        region: req.user.region,
        daptik: { $lte: byDate },
        $or: [
          { panaikinta: { $in: emptyDateValues } },
          { panaikinta: { $gt: byDate } }
        ]
      };

      if (req.query.whichDefects === "overdued") {
        defectsFilter.$and = [
          { dtermin: { $nin: emptyDateValues } },
          { dtermin: { $lt: byDate } }
        ];
      }

      // console.log("defectsFilter", defectsFilter);

      // defect grouping
      const defectsGroup = {
        _id: { meistrija: "$meistrija", pavoj: "$pavoj", kkateg: "$kkateg" },
        count: { $sum: 1 }
      };

      return Promise.all([
        db.collection("meistrija").find(thingsFilter),
        db.collection("kkateg").find(thingsFilter),
        db.collection("pavoj").find(thingsFilter),
        db
          .collection("defects")
          .aggregate([{ $match: defectsFilter }, { $group: defectsGroup }])
      ]);
    })
    .then(cursors => Promise.all(cursors.map(c => c.toArray())))
    .then(arrays =>
      res.status(200).send({
        things: {
          meistrija: arrays[0],
          kkateg: arrays[1],
          pavoj: arrays[2]
        },
        data: arrays[3]
      })
    )
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

// @route GET api/report/to-inspect
// @desc creates list weldings which are (will be) allowed to inspect
// @for a particular date
// @access Public
router.get("/to-inspect", (req, res) => {
  // connect mongo
  MongoClient.connect(dbUri, { useNewUrlParser: true })
    .then(client => client.db(dbName))
    .then(db => {
      // thing  filter
      const toDate = getDate(req.query.todate);
      const userRegion = req.user.region;
      const toDateMinus30Days = addToDate(toDate, 0, 0, -30);
      const toDateMinus8Months = addToDate(toDate, 0, -8, 0);
      const toDateMinus2Years = addToDate(toDate, -2, 0, 0);

      return db.collection("weldings").aggregate([
        {
          $match: {
            region: userRegion,
            panaikinta: { $in: emptyDateValues }
          }
        },

        {
          $facet: {
            test2: [
              {
                $match: {
                  data2: { $in: emptyDateValues },
                  data3: { $in: emptyDateValues },
                  data4: { $in: emptyDateValues },
                  $and: [
                    { data1: { $nin: emptyDateValues } },
                    { data1: { $lt: toDateMinus30Days } }
                  ]
                }
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  linija: 1,
                  kelias: 1,
                  km: 1,
                  pk: 1,
                  m: 1,
                  siule: 1,
                  vbudas: 1,
                  data1: 1,
                  kelintas: { $literal: 2 },
                  galimanuo: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $add: [
                              {
                                $dateFromParts: {
                                  year: { $year: "$$date1" },
                                  month: { $month: "$$date1" },
                                  day: { $dayOfMonth: "$$date1" }
                                }
                              },
                              60000 * 60 * 24 * 30
                            ]
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  },
                  reikiaiki: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $add: [
                              {
                                $dateFromParts: {
                                  year: { $year: "$$date1" },
                                  month: { $month: "$$date1" },
                                  day: { $dayOfMonth: "$$date1" }
                                }
                              },
                              60000 * 60 * 24 * 40
                            ]
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  }
                }
              }
            ],
            test3: [
              {
                $match: {
                  data2: { $nin: emptyDateValues },
                  data3: { $in: emptyDateValues },
                  data4: { $in: emptyDateValues },
                  $and: [
                    { data1: { $nin: emptyDateValues } },
                    { data1: { $lt: toDateMinus8Months } }
                  ]
                }
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  linija: 1,
                  kelias: 1,
                  km: 1,
                  pk: 1,
                  m: 1,
                  siule: 1,
                  vbudas: 1,
                  data1: 1,
                  kelintas: { $literal: 3 },
                  galimanuo: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $cond: {
                              if: {$gt: [{$month: "$$date1"}, 4]},
                              then: {$dateFromParts: {
                                      year: { $add: [{$year: "$$date1"}, 1]},
                                      month: { $add: [{ $month: "$$date1" }, -4] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                              else: {$dateFromParts: {
                                      year: { $year: "$$date1" },
                                      month: { $add: [{ $month: "$$date1" }, 8] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                            }
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  },
                  reikiaiki: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $cond: {
                              if: {$gt: [{$month: "$$date1"}, 10]},
                              then: {$dateFromParts: {
                                      year: { $add: [{$year: "$$date1"}, 2]},
                                      month: { $add: [{ $month: "$$date1" }, -10] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                              else: {$dateFromParts: {
                                      year: { $add: [{$year: "$$date1"}, 1]},
                                      month: { $add: [{ $month: "$$date1" }, 2] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                            }
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  }
                }
              }
            ],
            test4: [
              {
                $match: {
                  data2: { $nin: emptyDateValues },
                  data3: { $nin: emptyDateValues },
                  data4: { $in: emptyDateValues },
                  $and: [
                    { data1: { $nin: emptyDateValues } },
                    { data1: { $lt: toDateMinus2Years } }
                  ]
                }
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  linija: 1,
                  kelias: 1,
                  km: 1,
                  pk: 1,
                  m: 1,
                  siule: 1,
                  vbudas: 1,
                  data1: 1,
                  kelintas: { $literal: 4 },
                  galimanuo: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $dateFromParts: {
                              year: { $add: [{ $year: "$$date1" }, 2] },
                              month: { $month: "$$date1" },
                              day: { $dayOfMonth: "$$date1" }
                            }
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  },
                  reikiaiki: {
                    $let: {
                      vars: {
                        date1: { $dateFromString: { dateString: "$data1" } }
                      },
                      in: {
                        $dateToString: {
                          date: {
                            $cond: {
                              if: {$gt: [{$month: "$$date1"}, 6]},
                              then: {$dateFromParts: {
                                      year: { $add: [{$year: "$$date1"}, 3]},
                                      month: { $add: [{ $month: "$$date1" }, -6] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                              else: {$dateFromParts: {
                                      year: { $add: [{$year: "$$date1"}, 2]},
                                      month: { $add: [{ $month: "$$date1" }, 6] },
                                      day: { $dayOfMonth: "$$date1" }
                                    }},
                            }
                          },
                          format: "%Y-%m-%d"
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        },
        {
          $project: {
            tests: { $concatArrays: ["$test2", "$test3", "$test4"] }
          }
        },
        { $unwind: "$tests" },
        { $replaceRoot: { newRoot: "$tests" } }
      ]);
    })
    .then(cursor => cursor.toArray())
    .then(arr => res.status(200).send(arr))
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

// @route GET api/report/k33
// @desc creates a k33 report for a period
// @access Public
router.get("/k33", (req, res) => {
  // connect mongo
  MongoClient.connect(dbUri, { useNewUrlParser: true })
    .then(client => client.db(dbName))
    .then(db => {
      // thing  filter
      const startDate = getDate(req.query.startDate);
      const endDate = getDate(req.query.endDate);
      // patikrinti ar datos
      if (startDate > endDate)
        throw {
          message:
            "Periodo pradžios data negali būti vėlesnė už periodo pabaigos datą"
        };
      const userRegion = req.user.region;

      const operatFilter = {
        $and: [
          { $or: [{ region: userRegion }, { region: { $exists: false } }] },
          {
            $or: [
              { started: { $in: emptyDateValues } },
              { started: { $lte: endDate } }
            ]
          },
          {
            $or: [
              { stopped: { $in: emptyDateValues } },
              { stopped: { $gte: startDate } }
            ]
          }
        ]
      };

      const defskopFilter = {
        $and: [
          { $or: [{ region: userRegion }, { region: { $exists: false } }] },
          {
            $or: [
              { started: { $in: emptyDateValues } },
              { started: { $lte: endDate } }
            ]
          },
          {
            $or: [
              { stopped: { $in: emptyDateValues } },
              { stopped: { $gte: startDate } }
            ]
          }
        ]
      };

      const pavojFilter = {
        $or: [{ region: userRegion }, { region: { $exists: false } }]
      };

      const vbudasFilter = {
        $or: [{ region: userRegion }, { region: { $exists: false } }]
      };

      const defectFilter = {
        region: userRegion,
        $and: [{ daptik: { $gte: startDate } }, { daptik: { $lte: endDate } }]
      };

      // defect grouping
      const defectGrouping = {
        _id: { operat: "$oper", defskop: "$apar", pavoj: "$pavoj" },
        count: { $sum: 1 }
      };

      // welding grouping
      const weldingGrouping = {
        _id: { operat: "$operat", defskop: "$aparat", vbudas: "$vbudas" },
        count: { $sum: 1 }
      };

      return Promise.all([
        db.collection("operat").find(operatFilter),
        db.collection("defskop").find(defskopFilter),
        db.collection("pavoj").find(pavojFilter),
        db.collection("vbudas").find(vbudasFilter),
        db
          .collection("defects")
          .aggregate([{ $match: defectFilter }, { $group: defectGrouping }]),
        db.collection("weldings").aggregate([
          { $match: { region: userRegion } },

          {
            $facet: {
              test1: [
                {
                  $match: {
                    $and: [
                      { data1: { $nin: emptyDateValues } },
                      { data1: { $gte: startDate } },
                      { data1: { $lte: endDate } }
                    ]
                  }
                },
                {
                  $project: {
                    _id: 0,
                    operat: "$oper1",
                    aparat: "$apar1",
                    vbudas: "$vbudas"
                  }
                }
              ],
              test2: [
                {
                  $match: {
                    $and: [
                      { data2: { $nin: emptyDateValues } },
                      { data2: { $gte: startDate } },
                      { data2: { $lte: endDate } }
                    ]
                  }
                },
                {
                  $project: {
                    _id: 0,
                    operat: "$oper2",
                    aparat: "$apar2",
                    vbudas: "$vbudas"
                  }
                }
              ],
              test3: [
                {
                  $match: {
                    $and: [
                      { data3: { $nin: emptyDateValues } },
                      { data3: { $gte: startDate } },
                      { data3: { $lte: endDate } }
                    ]
                  }
                },
                {
                  $project: {
                    _id: 0,
                    operat: "$oper3",
                    aparat: "$apar3",
                    vbudas: "$vbudas"
                  }
                }
              ],
              test4: [
                {
                  $match: {
                    $and: [
                      { data4: { $nin: emptyDateValues } },
                      { data4: { $gte: startDate } },
                      { data4: { $lte: endDate } }
                    ]
                  }
                },
                {
                  $project: {
                    _id: 0,
                    operat: "$oper4",
                    aparat: "$apar4",
                    vbudas: "$vbudas"
                  }
                }
              ]
            }
          },
          {
            $project: {
              tests: { $concatArrays: ["$test1", "$test2", "$test3", "$test4"] }
            }
          },
          { $unwind: "$tests" },
          { $replaceRoot: { newRoot: "$tests" } },
          {
            $group: {
              _id: { operat: "$operat", defskop: "$aparat", vbudas: "$vbudas" },
              count: { $sum: 1 }
            }
          }
        ])
      ]);
    })
    .then(cursors => Promise.all(cursors.map(c => c.toArray())))
    .then(arrays =>
      res.status(200).send({
        things: {
          operat: arrays[0],
          defskop: arrays[1],
          pavoj: arrays[2],
          vbudas: arrays[3]
        },
        data: {
          defectCounts: arrays[4],
          weldingCounts: arrays[5]
        }
      })
    )
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

module.exports = router;
