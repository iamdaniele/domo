const html = (...values) => {
  const [stringTemplate, ...parts] = values;
  const template = document.createElement('template');
  template.innerHTML = stringTemplate.reduce((html, el, idx) => html + el + (parts[idx] || ''), '');
  return template;
}

const registry = new Set();

const classNameFromTag = tag =>
  tag
    .split('-')
    .map(part => 
      part
        .charAt(0)
        .toUpperCase() + 
      part
        .slice(1)
        .toLowerCase())
    .join('');

const init = (target = document) => target.querySelectorAll('*').forEach(async el => {
  if (!el.tagName.includes('-')) {
    return;
  }
  const tag = el.tagName.toLowerCase();
  const href = document.querySelector('link[rel="components"]')?.href;
  const path = `./${tag}.js`;

  try {
    const module = await import(href || path);
    if (!registry.has(tag)) {
      customElements.define(tag, href ? module[classNameFromTag(tag)] : module.default);
      await customElements.whenDefined(tag);
      registry.add(tag);  
    }
  } catch (e) {
    if (e instanceof TypeError) {
      console.error(`Cannot find controller for element ${tag}. Please check that the controller file is accessible and try again (${e.message}).`);
    }   
  }
});

const setupListeners = (fragment, element) => {
  for (const el of fragment.children) {
    if (el.children.length > 0) {
      setupListeners(el.children, element);
    }
    
    el
      .getAttributeNames()
      .filter(key => key.match(/^on\-/))
      .map(key => el.addEventListener(key.replace('on-', ''), element[el.getAttribute(key)].bind(element), false));
  }  
}

const render = element => {
  if (element.componentWillRender()) {
    const template = element.render();
    element.shadowRoot.innerHTML = template.innerHTML;
    setupListeners(element.shadowRoot, element);
  }
}

export default class extends HTMLElement {
  constructor() {
    super();
    this.state = this.getInitialState();

    this.attachShadow({ mode: 'open' });

    new MutationObserver(mutations => {
      if (mutations.includes(mutation => mutation.type === 'childList')) {
        console.log('childlist')
        init(this.shadowRoot);
      }

      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName.match(/data-/)) {
          const datasetKey = mutation.attributeName.replace('data-', '');
          mutation.newValue = mutation.target.dataset[datasetKey];
          mutation.datasetKey = datasetKey;
          this.didUpdateDataset(mutation);
        }
      });
    }).observe(this, {attributes: true, childList: true, subtree: true, attributeOldValue: true});
    render(this);
    init(this.shadowRoot);
  }
   
  setState(value) {
    const newstate = JSON.stringify(value);
    if (newstate === null) {
      return true;
    }

    const oldstate = JSON.stringify(this.state);
    if (oldstate !== newstate) {
      this.state = Object.assign(this.state, JSON.parse(newstate));
      this.stateDidChange();
      render(this);
    }
  }
  
  getInitialState() { return { } }
  stateDidChange() { }
  componentWillRender() { return true }
  didUpdateDataset(mutation) { }
  render() { }
  
  connectedCallback() {
    this.render();  
  }
}

export { init, html };