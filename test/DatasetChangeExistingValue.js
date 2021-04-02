import DatasetChangeTest from '/test/DatasetChange.js';

export default class DatasetChangeExistingValue extends DatasetChangeTest {
  didUpdateDataset() {
    if (this.dataset.value) {
      this.setState({success: true});
    }
  }
}