import Domo, { html } from '/domo.js'

export default class TestSuite extends Domo {
  clickHandler({target}) {
    const [ test ] = Object.keys(target.tests);
    target.pass(test);
  }

  callbackMethod() { return 'test successful' }

  render() {
    return html`
      <diff-test />
      <dataset-change />
      <event-binding on-click="clickHandler" />
      <callback-test cb-test-callback="${this.callbackMethod}" />
    `;
  }
}
