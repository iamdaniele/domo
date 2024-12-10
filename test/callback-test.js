import DomoTest from '/test/domo-test.js';
import Domo, { html } from '/domo.js';

export default class CallbackTest extends DomoTest {
  get name() { return 'Callback Tests' }
  
  get tests() {
    return {
      'callback exists': {
        testFn: () => typeof this.testCallback === 'function',
        expected: true,
      },
      'basic callback execution': {
        testFn: () => this.testCallback(),
        expected: 'test successful',
      },
    }
  }

  runTest() {
    Object.keys(this.tests).map((name) => {
      const { testFn, expected } = this.tests[name];
      const result = testFn();
      if (result === expected) {
        this.pass(name);
      } else {
        this.fail(name);
      }
    });
  }
}