import Domo, { html } from '/domo.js'

export default class TestSuite extends Domo {
  clickHandler({target}) {
    const element = this.shadowRoot.querySelector('event-binding');
    target.isEqualNode(element) ? element.pass(element.dataset.currentTest) : element.fail(element.dataset.currentTest);
  }

  render() {
    return html`
      <diff-test></diff-test>
      <dataset-change></dataset-change>
      <event-binding on-click="clickHandler"></event-binding>
    `;
  }
}
