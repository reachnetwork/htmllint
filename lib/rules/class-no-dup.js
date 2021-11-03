const Issue = require('../issue');
const proc = require('../process_option');

module.exports = {
  name: 'class-no-dup',
  on: ['class'],
  desc: 'If set, the same class name cannot be repeated within a `class` attribute.'
};

module.exports.lint = function (classes, opts) {
  const issues = [];
  classes = proc.chimeraClean(classes).sort();
  for (var i = 0; i < classes.length - 1; i++) {
    if (classes[i + 1] === classes[i]) {
      issues.push(new Issue('E041', classes.lineCol, { classes: classes[i] }));
    }
  }
  return issues;
}
