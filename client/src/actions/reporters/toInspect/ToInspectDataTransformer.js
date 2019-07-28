export class ToInspectDataTransformer {
  data;
  constructor(data) {
    this.data = data;
  }

  createReport() {
    return this.data;
  }
}
