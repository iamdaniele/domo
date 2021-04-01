class DatasetDeleteValue extends DatasetChangeTest {
  didUpdateDataset() {
    if (!this.dataset.value) {
      this.setState({success: true});
    }
  }
}