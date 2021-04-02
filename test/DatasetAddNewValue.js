import DatasetChangeTest from '/test/DatasetChange.js';

export default class DatasetAddNewValue extends DatasetChangeTest {
  didUpdateDataset() {
    if (this.dataset.value === this.dataset.expected) {
      this.setState({success: true});
    }
  }
}