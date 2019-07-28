import UDDataTransformer from "./UDDataTransformer";

export class UDDataNumberTransformer extends UDDataTransformer {

  createDefectCountGroups(things) {
    const kkateg = [
        { label: "1", ind: 1, ids: ["1"] },
        { label: "2", ind: 2, ids: ["2"] },
        { label: "3, 4", ind: 3, ids: ["3", "4"] },
        { label: "kt.", ind: 4, ids: ["5", "6", "7"] }
      ];

    const meistrija = things.meistrija
        .map(m => ({ label: m.abbr, ind: m.ind, ids: [m.id] }))
        .sort(this.byIndSorter);

    const pavoj = things.pavoj
        .filter(p => p.id !== "L")
        .map(p => ({ label: p.id, ind: p.ind, ids: [p.id] }))
        .sort(this.byIndSorterDesc);
        
    return {meistrija, pavoj, kkateg}  
  }

  createReport() {
    const groups = this.createDefectCountGroups(this.things);

    // skirta išfiltruoti defectCount'us, kurie atitinka konkrečias
    // meistrijas, kategorijas ir pavojingumus
    const fitFunction = (meistrijaIds, kkategIds, pavojIds) => {
      return defectCount => meistrijaIds.includes(defectCount._id.meistrija) &&
        kkategIds.includes(defectCount._id.kkateg) && 
        pavojIds.includes(defectCount._id.pavoj);
    }

    // susumuoja count iš defectCountų masyvo
    const sumReducer = (acc, curr) => acc + curr.count;

    // pagal meistrijų, kkateg'ų ir pavojų ids išfiltruoja tinkančius defectCountus ir 
    // susumuoja jų count property values
    const sumCounts = (defectCounts, meistrijaIds, kkategIds, pavojIds) =>
      defectCounts.filter(fitFunction(meistrijaIds, kkategIds, pavojIds)).reduce(sumReducer, 0);

    // veiksmas
    return groups.meistrija.map(m => ({...m, kkateg: groups.kkateg.map(kk => ({...kk, pavoj: groups.pavoj.map(p => ({...p, count: sumCounts(this.data, m.ids, kk.ids, p.ids)}))}))}));
  }
}