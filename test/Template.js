import { template } from '/emitter.js';
import EmitterTest from '/test/GeneralTest.js';
export default class Template extends EmitterTest {
  constructor(element) {
    super(element);
  }

  render() {
    super.render();
    const t1 = template.Template;
    t1.hidden = false;

    const t2 = template.TemplateWithEmitterClass;
    t2.hidden = false;
    this.component.appendChild(t1);
    this.component.appendChild(t2);
  }
}