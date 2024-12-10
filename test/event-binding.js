import DomoTest from '/test/domo-test.js';

export default class EventBinding extends DomoTest {
  get name() { return 'Event binding' }
  
  get tests() {
    return {
      'click event binding': {}
    }
  }

  runTest() {
    this.dispatchEvent(new MouseEvent('click'));
  }
}
