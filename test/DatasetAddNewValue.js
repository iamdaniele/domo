class DatasetAddNewValue extends DatasetChangeTest {
  didUpdateDataset() {
    if (this.dataset.value === this.dataset.expected) {
      this.setState({success: true});
    }
  }
}