# Emitter

A simple, reactive component state management library.

## Why Emitter

Low overhead projects, protoypes and rapid application development may require to iterate fast. In such cases, boilerplate code is usually kept to a minimum, while it may still be desirable to use a component API with state management similar to reactive hooks. Emitter can be useful when:

- Your project is more important than its framework (for example, when you're building sample code for educational purposes, and you don't want your audience to understand and navigate your project's dependencies)
- You need a small library with stable APIs and a relatively slow release cycle
- You want to use pure and modern JavaScript
- You want a straightforward controller architecture

## Emitter principles

- Zero or more components can be reactive.
- You define components in HTML, and change their state using an Emitter class
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
    import { init } from '/emitter.js';
    init();
  </script>
</html>
```

You'll define the component's behavior by describing its state and the events that trigger a state change. In this simple example, you separate the render logic from the state management, and you'll describe what the component should render for your known states. Your component encapsulates a [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) as a [custom HTML element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

By default, Emitter will look for a `<link rel="components">` to load controllers for your components. You can override this behavior by specifying a `module="/path/to/module.js` attribute in your custom element.

Your component can react on any of the standard DOM events, if specified as `on-*`. In this example, the button will react on click, since we setup `on-click`. When a click happens, `FizzBuzz.increment()` is called.

```js
import Emitter, { html } from '/emitter.js';

export default class FizzBuzz extends Emitter {
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
1. `getInitialState()` (optional) contains your initial state. This can be used to initialize your state ahead of a render. No render will occur as a result of specifying this state.
1. `setState(state)` accepts the new state. If the state is different from the current state, a render will occur. If you provide the exact same state, no rendering will occur.
1. `stateDidChange()` (optional) triggers if the state changed. This is useful to trigger any non-render activities, like fetching.
1. `didUpdateDataset()` (optional) triggers if the any of the component's `data-` attributes changed. This is useful to trigger a state change on DOM attribute changes.
1. `componentWillRender()` (optional) triggers before rendering a component. It can be used to detect circumstances where rendering is not needed. Simply return a falsey value to avoid rendering.
1. `render()` (optional) triggers on instantiation, and any time the state changed. In both cases, it will only trigger if `componentWillRender()` returns a non-falsey value. This method must return `null` or `undefined` to prevent rendering, or a `HTMLTemplateElement` to render content. Use the `html` tagged template to define your HTML and convert it automatically into an `HTMLTemplateElement`.

## Contributing

Your contributions are welcome. If you want to contribute, create an issue, fork this project and create a PR that can be reviewed. Issues can be created for bugs, new features, and items like code of conduct, roadmap and community support and guidelines.

## License

MIT
