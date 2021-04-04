class DatasetChange extends EmitterTest {
  constructor(element) {
    super(element);
    this.existingValue = this.childNodes(DatasetChangeExistingValue);
    this.addNewValue = this.childNodes(DatasetAddNewValue);
    this.deleteValue = this.childNodes(DatasetDeleteValue);
  }
}