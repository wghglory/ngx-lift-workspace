// Project-owned Clarity label adapter. Uses the public Angular ESLint rule and parser AST.
import angularTemplate from '@angular-eslint/eslint-plugin-template';

const upstream = angularTemplate.rules['label-has-associated-control'];
const controlNames = new Set(['input', 'select', 'textarea', 'meter', 'output', 'progress', 'cll-file-reader']);
function containsControl(node) {
  return controlNames.has(node.name) || (node.children ?? []).some(containsControl);
}
function clarityAssociation(node) {
  let parent = node.parent;
  while (parent && parent.type !== 'Element') parent = parent.parent;
  // The selection field assigns the direct label's ID to its actual role=grid and handles label-click focus.
  if (parent?.name === 'cll-datagrid-selection')
    return parent.children.filter((child) => child.name === 'clr-datagrid').length === 1;
  return parent?.name?.startsWith('clr-') && /-(container|wrapper)$/.test(parent.name) && containsControl(parent);
}
const rule = {
  meta: upstream.meta,
  create(context) {
    const visitors = upstream.create(context);
    return Object.fromEntries(
      Object.entries(visitors).map(([selector, visit]) => [
        selector,
        selector === 'Element'
          ? (node) => {
              if (node.name === 'label' && clarityAssociation(node)) return;
              return visit(node);
            }
          : visit,
      ]),
    );
  },
};
const plugin = {
  meta: {name: 'eslint-plugin-label', version: '2.0.0'},
  rules: {'label-has-associated-control': rule},
  configs: {},
};
plugin.configs.recommended = [
  {
    files: ['**/*.html'],
    plugins: {label: plugin},
    rules: {'label/label-has-associated-control': 'error'},
  },
];
export default plugin;
