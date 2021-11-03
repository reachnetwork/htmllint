const lodash = require('lodash');
const Issue = require('../issue');
const proc = require('../process_option');

module.exports = {
  name: 'id-style',
  on: ['attr'],
  filter: ['id'],
  options: [{
    name: 'id-class-style',
    desc: [
      'A format specifier, or `false`. If set, `id`s and `class`es must fit the',
      'given format. May be overridden by `class-style` for `class`es.'
    ].join('\n'),
    process: proc.format,
    rules: ['class-style', 'id-style']
  }, {
    name: 'id-class-ignore-regex',
    desc: [
      'The value is either a string giving a regular expression or `false`. If',
      'set, `id`s and `class`es matching the given regular expression are ignored',
      'for the `id-class-style` rule. For example, excluding `{{...}}` classes',
      'used by Angular and other templating methods can be done with the regex',
      '`{{.*?}}`.'
    ].join('\n'),
    process: function (ignore) {
      return ignore && lodash.isString(ignore) ? new RegExp('(' + ignore + ')|\\s*$|\\s+', 'g') : undefined;
    },
    rules: [] // 'class', 'id-style'
  }]
};

module.exports.lint = function (attr, opts) {
  const format = opts['id-class-style'];
  const ignore = opts['id-class-ignore-regex'];
  const v = attr.value.replace(/\[\[[^\]]+\]\]/, 'placeholder').trim();

  if (ignore && ignore.test(v)) { return true; }
  if (format.test(v)) { return []; }

  return new Issue('E011', attr.valueLineCol, { attribute: 'id', format: format.desc, value: v });
};
