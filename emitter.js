var dispatchQueue = [];
var cache = new Map();
var init = false;

const moduleNameParts = moduleName => {
  let [path, className] = moduleName.split(':');
  if (!path.match(/\.\w?js$/) && !className) {
    className = path;
    path = null;
  } else {
    className = className || path.split('/').pop().replace(/\.\w?js$/, '');
  }

  return {className, path};
}
const resolveClassName = moduleName => moduleNameParts(moduleName).className;
const resolvePath = moduleName => moduleNameParts(moduleName).path;

document.addEventListener('readystatechange', () => {
  if (document.readyState !== 'complete') {
    return;
  }

  dispatchQueue.map(async dispatchFn => {
    const data = dispatchFn instanceof Promise ? await dispatchFn : dispatchFn;
    document.querySelectorAll('[e]').forEach(el => el.instance?.didReceiveData(data));
  });
});

export default class Emitter {
  setState(value) {
    const newstate = JSON.stringify(value);
    if (newstate === null) {
      return true;
    }

    const oldstate = JSON.stringify(this.state);
    if (oldstate !== newstate) {
      this.state = Object.assign(this.state, JSON.parse(newstate));
      this.stateDidChange();
      this.willRender() && this.render();
    }
  }
  
  didReceiveData(data) {}
  didUpdateDataset(data) {}
  stateDidChange() {}
  render() {}
  willRender() {return true}

  childNodes(className = null) {
    let selector = '[e]';
    if (typeof className === 'function') {
      selector = `[e$="${className.name}"]`;
    } else if (typeof className === 'string') {
      selector = `[e$="${className}"]`;
    } else if (className !== null) {
      throw new Error('childNode(): value must be of type Module or String.');
    }

    return this.component.querySelectorAll(selector);
  }

  constructor(element) {
    this.component = element;
    this.component.instance = this;
    this.dataset = this.component.dataset;
    this.state = typeof this.getInitialState === 'function' ? this.getInitialState() : {};

    [this.component, ...this.component.querySelectorAll(':not([e])')].forEach(el => {
      el.getAttributeNames().forEach(key => {
        if (key === 'e:class') {
          return false;
        }
        
        const event = key.replace('data-', '');
        const functionName = el.getAttribute(key);

        if (typeof this[functionName] === 'function' && typeof window[`on${event}`] !== 'undefined') {
          el.addEventListener(event, this[functionName].bind(this));
        }
        
      });
    });
  }

  static async init() {
    if (init) {
      console.warn('Emitter.init() already called.');
      return;
    }
    
    init = true;
    
    const initFn = async (elements) =>
      elements.forEach(async element => {
        if (element.childElementCount) {
          initFn(element.childNodes);
        }
console.log(element.instance)
        if (typeof element.hasAttribute === 'undefined' || element.instance) {
          return;
        }

        if (!element.hasAttribute('e')) {
          return;
        }
        
        const moduleName = element.getAttribute('e');
        const className = resolveClassName(moduleName);

        if (!cache.has(className)) {
          try {
            const path = resolvePath(moduleName);
            if (path) {
              const modules = await import(path);
              if (modules[className] || modules.default) {
                cache.set(className, modules[className] || modules.default);
              }
            }
          } catch (error) {
            console.error(`Error while loading Emitter module ${className}:`, error);
          }
        }

        const module = cache.get(className);
        let instance;
        try {
          instance = new module(element);
        } catch (e) {
          console.warn(e)
          console.error(`Emitter: module ${className} is not a valid object, or it has not been exported correctly.`)
        }
        element.instance.willRender() && element.instance.render();  

      });

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(async mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName.match(/data-/) && mutation.target.hasAttribute('e') && mutation.target.instance) {
            mutation.target.instance.didUpdateDataset(mutation.dataset);
          } else {
            await initFn(mutation.addedNodes);
          }
        });
      });
      
      observer.observe(document.body, {attributes: true, subtree: true, childList: true});
      const elements = document.querySelectorAll('[e]');
      await initFn(elements);
  }
}

const dispatch = async dispatchFn => {
  if (document.readyState !== 'complete') {
    dispatchQueue.push(dispatchFn);
    return;
  }

  const data = dispatchFn instanceof Promise ? await dispatchFn : dispatchFn;
  document.querySelectorAll(CSS.escape('[e]')).forEach(el => el.instance?.didReceiveData(data));
}

const template = new Proxy({}, {
  get(target, prop, receiver) {
    const template = document.querySelector(`template[for="${prop}"]`);
    if (!template) {
      throw new Error(`Cannot find a template for "${prop}". Ensure an <template for="${prop}"> element is present in the DOM.`);
    }
    return document.querySelector(`template[for="${prop}"]`).content.firstElementChild.cloneNode(true);
  }
});

export {Emitter, dispatch, template};