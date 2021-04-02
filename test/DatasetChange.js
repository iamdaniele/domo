import EmitterTest from '/test/GeneralTest.js';
import DatasetChangeExistingValue from '/test/DatasetChangeExistingValue.js';
import DatasetAddNewValue from '/test/DatasetAddNewValue.js';
import DatasetDeleteValue from '/test/DatasetDeleteValue.js';

export class DatasetChangeTest extends Emitter {
  getInitialState() {
    return {success: false};
  }

  componentWillRender() {
    return this.state.success;
  }

  render() {
    this.component.classList.add('success');
  }
}

export default class DatasetChange extends EmitterTest {
  constructor(element) {
    super(element);
    this.existingValue = this.childNodes(DatasetChangeExistingValue);
    this.addNewValue = this.childNodes(DatasetAddNewValue);
    this.deleteValue = this.childNodes(DatasetDeleteValue);
  }
}