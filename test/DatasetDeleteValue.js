import DatasetChangeTest from '/test/DatasetChange.js';
export default class DatasetDeleteValue extends DatasetChangeTest {
  didUpdateDataset() {
    if (!this.dataset.value) {
      this.setState({success: true});
    }
  }
}