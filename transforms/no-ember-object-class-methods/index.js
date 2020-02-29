const { getParser } = require('codemod-cli').jscodeshift;
const ensureImport = require('../../utils/ensure-import');
const objectMethods = [
  'incrementProperty',
  'decrementProperty',
  'toggleProperty',
  'addObserver',
  'removeObserver',
  'notifyPropertyChange',
];

module.exports = function transformer(file, api) {
  const j = getParser(api);

  // During replacement, we populate these arrays with any util methods we use from `objectMethods`
  const objectMethodsUsed = [];
  const observerMethodsUsed = [];

  const ast = j(file.source);

  // Do replacements
  ast
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'ThisExpression',
        },
      },
    })
    .replaceWith(({ node }) => {
      const { callee } = node;
      if (objectMethods.includes(callee.property.name)) {
        let key, value;
        switch (callee.property.name) {
          case 'incrementProperty':
          case 'decrementProperty':
            node.comments = node.comments || [];
            node.comments.push(
              j.commentLine(' TODO: remove `parseFloat` if this value is an integer'),
              j.commentLine(' TODO: remove `|| 0` if this value is initialized and never undefined')
            );
            if (!objectMethodsUsed.includes('get')) {
              objectMethodsUsed.push('get');
            }
            if (!objectMethodsUsed.includes('set')) {
              objectMethodsUsed.push('set');
            }
            key = node.arguments[0];
            value = node.arguments[1] ? node.arguments.pop() : j.identifier('1');
            node.callee = j.identifier('set');
            node.arguments.unshift(j.thisExpression());
            node.arguments.push(
              j.binaryExpression(
                callee.property.name === 'incrementProperty' ? '+' : '-',
                j.logicalExpression(
                  '||',
                  j.callExpression(j.identifier('parseFloat'), [
                    j.callExpression(j.identifier('get'), [j.thisExpression(), key]),
                  ]),
                  j.identifier('0')
                ),
                value
              )
            );
            break;
          case 'toggleProperty':
            if (!objectMethodsUsed.includes('get')) {
              objectMethodsUsed.push('get');
            }
            if (!objectMethodsUsed.includes('set')) {
              objectMethodsUsed.push('set');
            }
            key = node.arguments[0];
            node.callee = j.identifier('set');
            node.arguments.unshift(j.thisExpression());
            node.arguments.push(
              j.unaryExpression(
                '!',
                j.callExpression(j.identifier('get'), [j.thisExpression(), key])
              )
            );
            break;
          case 'addObserver':
          case 'removeObserver':
            if (!observerMethodsUsed.includes(callee.property.name)) {
              observerMethodsUsed.push(callee.property.name);
            }
            node.callee = j.identifier(callee.property.name);
            node.arguments.unshift(j.thisExpression());
            break;
          default:
            if (!objectMethodsUsed.includes(callee.property.name)) {
              objectMethodsUsed.push(callee.property.name);
            }
            node.callee = j.identifier(callee.property.name);
            node.arguments.unshift(j.thisExpression());
        }
      }
      return node;
    });

  // Update imports if necessary
  if (objectMethodsUsed.length) {
    objectMethodsUsed.sort();
    ensureImport(ast, j, objectMethodsUsed, '@ember/object');
  }
  if (observerMethodsUsed.length) {
    observerMethodsUsed.sort();
    ensureImport(ast, j, observerMethodsUsed, '@ember/object/observers');
  }

  return ast.toSource();
};
