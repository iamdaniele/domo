((w) => {
  var dispatchQueue = [];

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') {
      return;
    }

    dispatchQueue.map(async dispatchFn => {
      const data = dispatchFn instanceof Promise ? await dispatchFn : dispatchFn;
      document.querySelectorAll('[e\\:class]').forEach(el => Emitter.registry.get(el)?.didReceiveData(data));
    });
  });

  class Emitter {
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
      let selector = '';
      if (typeof className === 'function') {
        selector = '=' + className.name;
      } else if (typeof className === 'string') {
        selector = '=' + className;
      }

      return this.component.querySelectorAll(`[e\\:class${selector}]`);
    }

    constructor(element) {
      this.component = element;
      this.component.instance = this;
      this.dataset = this.component.dataset;
      this.state = typeof this.getInitialState === 'function' ? this.getInitialState() : {};

      [this.component, ...this.component.querySelectorAll(':not([e\\:class])')].forEach(el => {
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

    static async dispatch(dispatchFn) {
      if (document.readyState !== 'complete') {
        dispatchQueue.push(dispatchFn);
        return;
      }

      const data = dispatchFn instanceof Promise ? await dispatchFn : dispatchFn;
      document.querySelectorAll('[e\\:class]').forEach(el => Emitter.registry.get(el)?.didReceiveData(data));
    }

    static init(path = '') {
      const elements = document.querySelectorAll('[e\\:class]');
      const initFn = (elements) =>
        elements.forEach(element => {
          if (element.childElementCount) {
            initFn(element.childNodes);
          }

          if (typeof element.hasAttribute === 'undefined' || Emitter.registry.has(element)) {
            return;
          }

          if (!element.hasAttribute('e:class')) {
            return;
          }
          
          const className = element.getAttribute('e:class');
          const fn = new Function('element', `return new ${className}(element)`);
          if (new Function(`return typeof ${className} !== 'undefined'`)()) {
            Emitter.registry.set(element, fn(element));
            element.instance.willRender() && element.instance.render();
          }

          if (!document.querySelector(`script[for='${className}']`)) {
            const script = document.createElement('script');
            script.setAttribute('src', `${path}${className}.js`);
            script.setAttribute('async', '');
            script.setAttribute('for', className);
            script.onload = () => {
              document.querySelectorAll(`[e\\:class=${className}]`).forEach(element => {
                Emitter.registry.set(element, fn(element));
                element.instance.willRender() && element.instance.render();
              });
            };
            document.head.appendChild(script);
          }
        });

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName.match(/data-/) && mutation.target.hasAttribute('e:class') && mutation.target.instance) {
              mutation.target.instance.didUpdateDataset(mutation.dataset);
            } else {
              initFn(mutation.addedNodes);
            }
          });
        });
        observer.observe(document.body, {attributes: true, subtree: true, childList: true});
        initFn(elements);
    }
  }
  Emitter.registry = new WeakMap();
  Emitter.template = new Proxy({}, {
    get(target, prop, receiver) {
      const template = document.querySelector(`template[for="${prop}"]`);
      if (!template) {
        throw new Error(`Cannot find ${prop} template`);
      }
      return document.querySelector(`template[for="${prop}"]`).content.firstElementChild.cloneNode(true);
    }
  });
  w.Emitter = Emitter;
})(window);