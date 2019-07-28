export class K33DataTransformer {
  vbudai;
  pavojai;
  operatoriai;
  defskopai;
  defects;
  weldings;

  constructor(thingsAndData) {
    this.vbudai = thingsAndData.things.vbudas;
    this.pavojai = thingsAndData.things.pavoj;
    this.operatoriai = thingsAndData.things.operat;
    this.defskopai = thingsAndData.things.defskop;
    this.defectCounts = thingsAndData.data.defectCounts;
    this.weldingCounts = thingsAndData.data.weldingCounts;
  }

  byIndSorter = (a, b) => a.ind - b.ind;

  createVbudasGroups = () => {
    return this.vbudai.sort(this.byIndSorter).map(vb => ({id: vb.id}));
  };

  createPavojGroups = () => {
    return this.pavojai.sort(this.byIndSorter).map(pav => ({id: pav.id}));
  };

  createPropertyGroups = () => {
    return {
      pavojai: [...this.createPavojGroups()], 
      vbudai: [...this.createVbudasGroups()]
    };
  };

  createDistinctOperatDefskop = () => {
    // mėginau
    // [
    //   {defskop: {id: aaa, model: bbb, ...}, operat: {id: ccc, name: ddd, ...}},
    //   {defskop: {id: eee, model: fff, ...}, operat: {id: ggg, name: hhh, ...}},
    //   {defskop: {id: iii, model: jjj, ...}, operat: {id: kkk, name: lll, ...}},
    //   ....
    // ]
    // , bet nusprendžiau, kad užteks
    // [
    //   {defskop: aaa, operat: bbb},
    //   {defskop: ccc, operat: ddd},
    //   {defskop: eee, operat: fff},
    //   ....
    // ]
    return [
      ...this.defectCounts.map(c => ({defskop: c._id.defskop, operat: c._id.operat})),      
      ...this.weldingCounts.map(c => ({defskop: c._id.defskop, operat: c._id.operat})),
    ].filter(
        (v, i, a) => a.findIndex(x => x.defskop === v.defskop && x.operat === v.operat) === i
      )
      .sort(
        (a, b) => {
          if (a.defskop > b.defskop) return 1;
          if (a.defskop < b.defskop) return -1;
          if (a.operat > b.operat) return 1;
          if (a.operat < b.operat) return -1;
          return 0;
        }
      );
  };

  distribute = () => {
    
    let operDefPairs = this.createDistinctOperatDefskop();
    // console.log("operDefPairs", operDefPairs);
    // [
    //   {defskop: aaa, operat: bbb},
    //   {defskop: ccc, operat: ddd},
    //   {defskop: eee, operat: fff},
    //   ....
    // ]
    return operDefPairs.map(odPair => {
      // 0. current defectoskop-operator pair:
      //    {defskop: aaa, operat: bbb}

      // 1. find all defectPavojCounts for this particular defektoskop-operator pair
      const defectPavojCounts = this.defectCounts.filter(dc => dc._id.defskop === odPair.defskop && dc._id.operat === odPair.operat);
      // [
      //   {_id: {operat: aaa, defskop: bbb, pavoj: "D1"}, count: ???},
      //   {_id: {operat: aaa, defskop: bbb, pavoj: "D2"}, count: ???},
      //   {_id: {operat: aaa, defskop: bbb, pavoj: "D3"}, count: ???}
      // ]

      // 2. find all weldingVbudasCounts for this particular defektoskop-operator pair
      const weldingVbudasCounts = this.weldingCounts.filter(wc => wc._id.defskop === odPair.defskop && wc._id.operat === odPair.operat);
      // [
      //   {_id: {operat: aaa, defskop: bbb, vbudas: "t"}, count: ???},
      //   {_id: {operat: aaa, defskop: bbb, vbudas: "e"}, count: ???}
      // ]

      const propGroupContainer = this.createPropertyGroups();
      // {
      //   vbudai: [
      //     {id: "t"},
      //     {id: "e"}
      //   ]
      //   pavoj: [
      //     {id: "D3"},
      //     {id: "D2"},
      //     {id: "D1"},
      //     {id: "DP"},
      //     ....
      //   ]
      // }

      // 3. add property "count" to each propGroupContainer.pavojai array item:
      //  [
      //    {id: "t", count: n},
      //    {id: "e", count: z}
      //  ]
      const propGroupVB = propGroupContainer.vbudai.map(vb => {
        const weldingVbudasCount = weldingVbudasCounts.find(wvc => wvc._id.vbudas === vb.id);
        if (weldingVbudasCount !== undefined) {
          vb.count = weldingVbudasCount.count; 
        } else {
          vb.count = 0;
        }
        return vb;
      });

      // 4. add property "count" to each propGroupTemplate.vbudas array item:
      //  [
      //     {id: "D3", count: z},
      //     {id: "D2", count: x},
      //     {id: "D1", count: y,
      //     {id: "DP", count: u},
      //     ....
      //  ] 
      const propGroupPav = propGroupContainer.pavojai.map(pav => {
        const defectPavojCount = defectPavojCounts.find(dpc => dpc._id.pavoj === pav.id);
        if (defectPavojCount !== undefined) {
          pav.count = defectPavojCount.count; 
        } else {
          pav.count = 0;
        }
        return pav;
      });

      // 5. add property "counts" to this particular defectoskop-operator pair :
      //    {
      //      defskop: aaa, 
      //      operat: bbb, 
      //      counts: [
      //        {id: "t", count: n},
      //        {id: "e", count: z},
      //        {id: "D3", count: z},
      //        {id: "D2", count: x},
      //        {id: "D1", count: y,
      //        {id: "DP", count: u},
      //        ....
      //      ]
      //    }
      odPair.counts = [...propGroupPav, ...propGroupVB];

      // console.log("current odPair", odPair)
      return odPair;
    });

  }

  createReport() {
    return this.distribute();
  }
}
