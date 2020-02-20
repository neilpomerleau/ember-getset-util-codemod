# no-ember-object-class-methods

This codemod transforms usages of the following EmberObject class methods on `this` to use the functional equivalents:

* incrementProperty
* decrementProperty
* toggleProperty
* addObserver
* removeObserver
* notifyPropertyChange

## Usage

```
npx neilpomerleau/ember-no-ember-object-class-methods-codemod no-ember-object-class-methods path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [existing-imports](#existing-imports)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/no-ember-object-class-methods/__testfixtures__/basic.input.js)</small>):
```js
import Service from '@ember/service';

export default Service.extend({
  init() {
    this.incrementProperty('foo');
    this.decrementProperty('bar');
    this.incrementProperty('baz', 2);
    this.decrementProperty('biz', 3.14);
    console.log(this.toggleProperty('foo'));
  },

  doStuff() {
    this.addObserver('bar', observer);
    this.removeObserver('baz', observer);
    this.notifyPropertyChange('biz');
  },
});

```

**Output** (<small>[basic.output.js](transforms/no-ember-object-class-methods/__testfixtures__/basic.output.js)</small>):
```js
import { addObserver, get, notifyPropertyChange, removeObserver, set } from "@ember/object";
import Service from '@ember/service';

export default Service.extend({
  init() {
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'foo', (parseFloat(get(this, 'foo')) || 0) + 1);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'bar', (parseFloat(get(this, 'bar')) || 0) - 1);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'baz', (parseFloat(get(this, 'baz')) || 0) + 2);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'biz', (parseFloat(get(this, 'biz')) || 0) - 3.14);
    console.log(set(this, 'foo', !get(this, 'foo')));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    notifyPropertyChange(this, 'biz');
  },
});

```
---
<a id="existing-imports">**existing-imports**</a>

**Input** (<small>[existing-imports.input.js](transforms/no-ember-object-class-methods/__testfixtures__/existing-imports.input.js)</small>):
```js
import { addObserver, removeObserver } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  init() {
    this.incrementProperty('foo');
    this.decrementProperty('bar');
    // Existing comment
    this.incrementProperty('baz', 2);
    this.decrementProperty('biz', 3.14);
    console.log(this.toggleProperty('foo'));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    this.notifyPropertyChange('biz');
  },
});
```

**Output** (<small>[existing-imports.output.js](transforms/no-ember-object-class-methods/__testfixtures__/existing-imports.output.js)</small>):
```js
import { addObserver, removeObserver, get, notifyPropertyChange, set } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  init() {
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'foo', (parseFloat(get(this, 'foo')) || 0) + 1);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'bar', (parseFloat(get(this, 'bar')) || 0) - 1);
    // Existing comment
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'baz', (parseFloat(get(this, 'baz')) || 0) + 2);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'biz', (parseFloat(get(this, 'biz')) || 0) - 3.14);
    console.log(set(this, 'foo', !get(this, 'foo')));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    notifyPropertyChange(this, 'biz');
  },
});

```
<!--FIXTURES_CONTENT_END-->
