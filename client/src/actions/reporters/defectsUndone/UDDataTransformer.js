export default class UDDataTransformer {
  things;
  data;

  constructor(thingsAndData) {
    // data comes from reportActions
    this.things = thingsAndData.things;
    this.data = thingsAndData.data;
  }

  byIndSorter(a, b, descending) {
    return a.ind - b.ind;
  }

  byIndSorterDesc(a, b) {
    return b.ind - a.ind;
  }
}