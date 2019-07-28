import UDDataTransformer from "./UDDataTransformer";

export class UDDataDefectsTransformer extends UDDataTransformer {
  byVietaSorter(a, b) {
    if (a.linija > b.linija) return 1;
    if (a.linija < b.linija) return -1;
    if (a.kelias > b.kelias) return 1;
    if (a.kelias < b.kelias) return -1;
    if (a.km > b.km) return 1;
    if (a.km < b.km) return -1;
    if (a.pk > b.pk) return 1;
    if (a.pk < b.pk) return -1;
    if (a.m > b.m) return 1;
    if (a.m < b.m) return -1;
    if (a.siule > b.siule) return 1;
    if (a.siule < b.siule) return -1;
    if (a.iesmas > b.iesmas) return 1;
    if (a.iesmas < b.iesmas) return -1;
    if (a.nr > b.nr) return 1;
    if (a.nr < b.nr) return -1;
    return 0;
  }

  distributeDefects(defs) {
    // gauna filtruotus defektus iš serverio.
    // paskirsto defektus po meistrijas ir tinkamai išrikiuoja
    return this.things.meistrija
      .map(meistrija => {
        return {
          ...meistrija,
          defects: defs
            .filter(d => d.meistrija === meistrija.id)
            .sort(this.byVietaSorter)
        };
      })
      .sort(this.byIndSorter);
  }

  createReport() {
    // console.log("this.data", this.data);
    return this.distributeDefects(this.data);
  }
}
