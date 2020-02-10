# ember-get


## Usage

```
npx ember-get-set ember-get path/of/files/ or/some**/*glob.js

# or

yarn global add ember-get-set
ember-get-set ember-get path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [no-replacements](#no-replacements)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/get-set-replace-all/__testfixtures__/basic.input.js)</small>):
```js
import { something } from 'something';
const foo = this.get('foo');
this.set('foo', true);
this.setProperties({ foo: 'bar' });
const { who, bar } = this.getProperties('who', 'bar');
const baz = this.getWithDefault('foo', false);
const objFoo = this.obj.get('foo');
this.obj.set('foo', objFoo);

```

**Output** (<small>[basic.output.js](transforms/get-set-replace-all/__testfixtures__/basic.output.js)</small>):
```js
import { get, set, setProperties, getProperties, getWithDefault } from '@ember/object';
import { something } from 'something';
const foo = get(this, 'foo');
set(this, 'foo', true);
setProperties(this, { foo: 'bar' });
const { who, bar } = getProperties(this, 'who', 'bar');
const baz = getWithDefault(this, 'foo', false);
const objFoo = get(this.obj, 'foo');
set(this.obj, 'foo', objFoo);

```
---
<a id="no-replacements">**no-replacements**</a>

**Input** (<small>[no-replacements.input.js](transforms/get-set-replace-all/__testfixtures__/no-replacements.input.js)</small>):
```js
import { something } from 'something';

function noGetSetHere() {
	return 5;
}

```

**Output** (<small>[no-replacements.output.js](transforms/get-set-replace-all/__testfixtures__/no-replacements.output.js)</small>):
```js
import { something } from 'something';

function noGetSetHere() {
	return 5;
}

```
<!--FIXTURES_CONTENT_END-->