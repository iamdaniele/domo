# Domo

A simple, reactive component state management library with DOM shadow encapsulation and DOM diffing.

## Why Domo

Low overhead projects, protoypes and rapid application development may require to iterate fast. In such cases, boilerplate code is usually kept to a minimum, while it may still be desirable to use a component API with state management. Domo can be useful when:

- Your project is more important than its framework (for example, when you're building sample code for educational purposes, and you don't want your audience to understand and navigate your project's dependencies)
- You need a small library with stable APIs and a relatively slow release cycle
- You want to use pure, modern JavaScript
- You want a straightforward controller architecture

## Domo principles

- Zero or more components can be reactive.
- You define components in HTML, and change their state using an Domo class
- Components render when their state changes (unless you prevent them from doing that)
- Components are not opinionated and their architecture is flexible

## Component architecture

First, define an entry point for your component in your page. Components are imported from a file.

```html
<html>
  <link rel="components" href="/path/to/components.js" />
  <body>
    <fizz-buzz />
  </body>
  <script type="module">
    import { init } from '/Domo.js';
    init();
  </script>
</html>
```

You'll define the component's behavior by describing its state and the events that trigger a state change. In this simple example, you separate the render logic from the state management, and you'll describe what the component should render for your known states. Your component encapsulates a [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) into a [custom HTML element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

By default, Domo will look for a `<link rel="components">` to load controllers for your components. You can override this behavior by specifying a `module="/path/to/module.js"` attribute in your custom element.

Your component can react on any of the standard DOM events, if specified as `on-*`. In this example, the button will react on click, since we setup `on-click`. When a click happens, `FizzBuzz.increment()` is called.

```js
import Domo, { html } from '/domo.js';

export default class FizzBuzz extends Domo {
  constructor() {
    super();
    this.timer = null;
  }

  getInitialState() {
    return { count: 0, shouldAutoIncrement: false };
  }

  increment() {
    this.setState({count: this.state.count + 1})
  }

  render() {
    return html`
      <div>Count: ${'' + this.state.count}</div>
      <button on-click="increment">Count++</button>
      <div ${this.state.count == 0 ? 'hidden' : ''}>${this.state.count % 3 === 0 ? 'Fizz' : ''}${this.state.count % 5 === 0 ? 'Buzz' : ''}</div>
    `;
  }
}
```

## Component lifecycle

1. `constructor()` gets called first. This is where your init logic should be. Always remember to call `super()` first thing.
1. `getInitialState()` (optional) contains your initial state. When implemented, this method should return an JSON encodable object. It can be used to define your component's initial state.
1. `setState(state)` accepts a new state. A render will occur if the new state is different from the current state. If you provide the exact same state, no rendering will occur.
1. `stateDidChange()` (optional) triggers if the state changed, but before a render. This is useful to trigger any non-render activities, like caching data.
1. `didUpdateDataset()` (optional) triggers if the any of the component's `data-` attributes changed. This is useful when you need to perform something when your component's dataset properties change.
1. `componentWillRender()` (optional) triggers before rendering a component. It can be used to detect circumstances where rendering is not needed. Simply return a falsey value to avoid rendering.
1. `render()` (optional) triggers on instantiation, and any time the state changed. In both cases, it will trigger only if `componentWillRender()` returns a non-falsey value. This method must return a `DocumentFragment` to render content. To do so, used the `html` tagged template to define your HTML and convert it automatically into a `DocumentFragment`. Return a falsey value to prevent rendering (this is useful when you don't need to change your component).
1. `componentDidRender()` (optional) triggers after the component rendered, or if `render()` returned a non falsey value.

## DOM diffing

Domo implements a DOM diffing algorithm to speed up rendering. When you build the HTML for your component in `render()`, you simply have to define what the component looks like. When `render()` triggers, Domo will determine what elements have changed by comparing your new component's HTML with the current DOM tree. Domo will render only the components that changed, and keep the rest of your component intact. Here's how the algorithm works:

1. It removes unneeded nodes at the end of the current DOM (for example, nodes that have been removed in the new DOM).
1. It adds new nodes to the end of the current DOM (for example, nodes that have been added in the new DOM and weren't present before)
1. It then performs a node-by-node comparison, and it replaces the old node with a new node if it has changed
1. Recurse and repeat.

## Contributing

Your contributions are welcome. If you want to contribute, create an issue, fork this project and create a PR that can be reviewed. Issues can be created for bugs, new features, and items like code of conduct, roadmap and community support and guidelines.

## License

MIT
