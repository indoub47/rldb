exports.COLLECTIONS = [
  {name: "bgamykl", actions: ["all"], hasRegion: false},
  {name: "btipas", actions: ["all"], hasRegion: false},
  {name: "defskop", actions: ["all"], hasRegion: true},
  {name: "operat", actions: ["all"], hasRegion: true},
  {name: "tbudas", actions: ["defectoscopes", "all"], hasRegion: false},
  {name: "kkateg", actions: ["all"], hasRegion: false},
  {name: "linst", actions: ["all"], hasRegion: true},
  {name: "linija", actions: ["all"], hasRegion: true},
  {name: "siule", actions: ["all"], hasRegion: false},
  {name: "vbudas", actions: ["all"], hasRegion: false},
  {name: "meistrija", actions: ["all"], hasRegion: true},
  {name: "pavoj", actions: ["all"], hasRegion: false},
  {name: "virino", actions: ["all"], hasRegion: true},
  {name: "vbudas", actions: ["all"], hasRegion: false},
  {name: "vpvd", actions: ["all"], hasRegion: false},
  {name: "itemstatus", actions: ["all"], hasRegion: false},
  {name: "region", actions: ["register_user"]},
  {name: "urole", actions: ["register_user"]}
];

exports.REGIONS = {
  1: {id: "1", name: "Vilniaus", bit: 1},
  2: {id: "2", name: "Kauno", bit: 2},
  3: {id: "3", name: "Šiaulių", bit: 4},
  4: {id: "4", name: "Klaipėdos", bit: 8}
}

// developement
exports.ERROR_PCT = 25.0;
exports.RANDOM_ERROR_ON = false;
exports.DELAY_RANGE = [250, 2000];
exports.SHOULD_DELAY = true;
