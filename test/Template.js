class Template extends EmitterTest {
  constructor(element) {
    super(element);
  }

  render() {
    super.render();
    const template = Emitter.template.Template;
    const templateWithClass = Emitter.template.TemplateWithEmitterClass;
    template.hidden = false;
    this.component.appendChild(template);
    this.component.appendChild(templateWithClass);
  }
}