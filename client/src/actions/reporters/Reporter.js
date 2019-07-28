import reporterMap from "./reporterMap";

export default class Reporter {
  reporter;

  constructor(rtype) {
    this.reporter = reporterMap[rtype];
  }

  // public
  createReport(data) {
    // console.log("createReport data params", data, params);
    const transformer = new this.reporter.DataTransformerClass(data);
    return transformer.createReport();
  }

  // public
  getUrl() {
    return this.reporter.apiUrl;
  }
}
