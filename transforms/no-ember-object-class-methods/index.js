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

  // During replacement, we populate this array with any util methods we use from `objectMethods`
  const utilMethodsUsed = [];

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
            if (!utilMethodsUsed.includes('get')) {
              utilMethodsUsed.push('get');
            }
            if (!utilMethodsUsed.includes('set')) {
              utilMethodsUsed.push('set');
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
            if (!utilMethodsUsed.includes('get')) {
              utilMethodsUsed.push('get');
            }
            if (!utilMethodsUsed.includes('set')) {
              utilMethodsUsed.push('set');
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
          default:
            if (!utilMethodsUsed.includes(callee.property.name)) {
              utilMethodsUsed.push(callee.property.name);
            }
            node.callee = j.identifier(callee.property.name);
            node.arguments.unshift(j.thisExpression());
        }
      }
      return node;
    });

  // Update imports if necessary
  if (utilMethodsUsed.length) {
    utilMethodsUsed.sort();

    ensureImport(ast, j, utilMethodsUsed, '@ember/object');
  }

  return ast.toSource();
};
