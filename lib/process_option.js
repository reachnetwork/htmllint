const lodash = require('lodash');

const formats = {
  lowercase: /^[a-z][a-z\d]*$/,
  underscore: /^[a-z][a-z\d]*(_[a-z\d]+)*$/,
  dash: /^[a-z][a-z\d]*(-[a-z\d]+)*$/,
  camel: /^[a-zA-Z][a-zA-Z\d]*$/,
  bem: /^([a-z]+([a-z0-9]*(\-?[a-z0-9]+)?)+)(__[a-z0-9]+(\-?[a-z0-9]+)*)?(--[a-z0-9]+(\-?[a-z0-9]+)*)?$/
};

function getRegExp(val, strFn) {
  if (lodash.isRegExp(val)) {
    return val;
  } else if (lodash.isString(val)) {
    const match = /^\/(.*?)\/([gim]*)$/.exec(val);
    return match ? new RegExp(match[1], match[2]) : strFn(val);
  } else {
    return undefined;
  }
}

module.exports = {
  bool: function (option) {
    return option ? true : false;
  },
  boolPlus: function (option) {
    return function (o) {
      return o === option ? option : o ? true : false;
    }
  },
  options: function (opts) {
    return function (o) {
      return opts.indexOf(o) > -1 ? o : undefined;
    }
  },
  regex: function (regex) {
    return getRegExp(regex, function (s) { return new RegExp(s); });
  },
  regexGlobal: function (r) {
    r = module.exports.regex(r);
    return r && new RegExp(r.source, r.ignoreCase ? 'gi' : 'g');
  },
  arrayOfAttrs: function (strs) {
    if (!lodash.isArray(strs)) { return undefined; }
    for (let i = 0; i < strs.length; i++) {
      strs[i] = getRegExp(strs[i], function(a) { return a.toLowerCase(); });
      if (!strs[i]) { return undefined; }
    }
    return strs;
  },
  posInt: function (i) {
    return (lodash.isInteger(i) && i >= 0) ? i : undefined;
  },
  format: function (name) {
    const regex = getRegExp(name, function (s) { return formats[s]; });
    return regex && { desc: name, test: regex.test.bind(regex) };
  },
  object: function (o) {
    return Object.keys(o).length > 0 ? o : {};
  },
  chimeraClean: function(initial) {
    const cleaned = [];
    let cleanedInd = 0;

    // loop over the initial item set
    for (let i = 0; i < initial.length; i++) {
      // add the current item to the array.
      cleaned.push(initial[i]);

      // If  we start with our var notation but do not end with it we need to add subsequent lines to this class
      if (initial[i].includes('[[') && !initial[i].includes(']]')) {
        let inFunc = true;
        while (inFunc) {
          i++;
          cleaned[cleanedInd] += initial[i]
          if (initial[i].includes(']]')) {
            inFunc = false;
          }
        }
      }

      // put in a placeholder for linting purposes
      cleaned[cleanedInd] = cleaned[cleanedInd].replace(/\[\[[^\]]+\]\]/, 'placeholder');

      // Finally, increment the cleaned index.
      cleanedInd++;
    }

    // Now let's add back in any extra params.
    const keys = Object.keys(initial);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] != parseInt(keys[i])) {
        // we're a non-index property, we need to add these back in
        cleaned[keys[i]] = initial[keys[i]];
      }
    }

    return cleaned;
  },
  getRegExp: getRegExp
};
