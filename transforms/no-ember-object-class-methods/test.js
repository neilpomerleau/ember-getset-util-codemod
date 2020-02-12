'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  type: 'jscodeshift',
  name: 'no-ember-object-class-methods',
});
