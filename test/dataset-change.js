import { DomoTest } from '/test/components.js';

export default class DatasetChange extends DomoTest {
  get name() { return 'Dataset Change' }
  get tests() {
    return {
      'add property': {
        oldValue: '',
        newValue: 'add property',
        expected: 'add property',
      },
    }
  }
  
  didUpdateDataset(mutation) { 
    this.pass(mutation.newValue);
  }

  compare(name, result, expected) {    
    if (result.added.length !== expected.added.length) {
      return this.fail(name);
    } else if (result.removed.length !== expected.removed.length) {
      return this.fail(name);
    } else if (expected.added.filter((element, i) => !element.isEqualNode(result.added[i])).length > 0) {
      return this.fail(name);
    } else if (expected.removed.filter((element, i) => !element.isEqualNode(result.removed[i])).length > 0) {
      return this.fail(name);
    }
    return this.pass(name);
  }

  runTest() {
    Object.keys(this.tests).map(name => {
      const test = this.tests[name];
      this.dataset.testProperty = test.newValue;
    });
  }
}
