/* !
 * redox
 * JavaScript RegExp based Doc generator
 * Copyright (c) 2012 Enrico Marino and Federico Spini
 * MIT License
 */

/**
 * Library namespace.
 */

var redox = exports;

/**
 * Library version.
 */

redox.version = '0.1.1';

/**
 * Parse a javascript source code and extract a json doc.
 *
 * @param {String} source code
 * @return {Object} json doc
 * @api public
 */

redox.parse = function (text) {
  var ret = {};
  var docs = [];
  var codes = [];
  var temp = '';
  var line = '';
  var length = text.length;
  var i = 0;
  var c = '';
  var begin_doc = /^ *\/\*\*+/;
  var end_doc = /^ *\*+\/ */;
  var new_line = '\n';
  var out_doc = 0;
  var in_doc = 1;
  var in_code = 2;
  var status = out_doc;

  text += '\n';

  while (i < length) {
    temp += line;
    line = '';
    c = '';

    while (c !== '\n') {
      c = text[i];
      line += c;
      i += 1;
    }

    if (status === out_doc) {
      if (begin_doc.test(line)) {
        status = in_doc;
        temp = '';
        line = '';
      }
      continue;
    }

    if (status === in_doc) {
      if (end_doc.test(line)) {
        status = in_code;
        data = redox.parse.doc(temp);
        docs.push(data);
        temp = '';
        line = '';
      }
      continue;
    }

    if (status === in_code) {
      if (begin_doc.test(line)) {
        status = in_doc;
        data = redox.parse.code(temp);
        codes.push(data);
        temp = '';
        line = '';
      }
      continue;
    }
  }

  return { docs: docs, codes: codes };
};

/** 
 * Parse doc
 *
 * @api private
 */

redox.parse.doc = function (text) {
  var parts = text.replace(/^ *\* /gm, '').split('\n@');
  var head = parts[0].split('\n\n');
  var body = parts.slice(1);
  var title = head[0];
  var summary = head.slice(1).join('\n\n');
  var tags = body.map(redox.parse.tag);

  return {
    title: title,
    summary: summary,
    tags: tags
  };
};

/** 
 * Parse code
 *
 * @api private
 */

redox.parse.code = function (text) {
  var rules = redox.snippets;
  var n = rules.length;
  var i;
  var match;

  for (i = 0; i < n; i++) {
    if (match = rules[i].regexp.exec('@' + text)) {
      return rules[i].generator(text, match);
    }
  }

  return { text: text };
};

/** 
 * Parse tag
 *   
 * @api private
 */

redox.parse.tag = function (text) {
  var rules = redox.tags;
  var n = rules.length;
  var i;
  var match;

  for (i = 0; i < n; i++) {
    if (match = rules[i].regexp.exec('@' + text)) {
      return rules[i].generator(text, match);
    }
  }

  return { text: text };
};

/**
 * tags
 */

redox.tags = [];

/**
 * tag @example
 */

redox.tags.push({
  regexp: /^@example/,
  generator: function (text, match) {
    return { text: text };
  }
});

/**
 * tag @param
 */

redox.tags.push({
  regexp: /@param +(\{ *\w+ *\}) +((\w+ *)*)/,
  generator: function (text, match) {
    return {
      types: match[1].slice(1,-1).split('|'),
      name: match[2].split(' ')[0],
      description: match[2].split(' ').slice(1).join(' ')
    };
  }
});

/**
 * tag @return
 */

redox.tags.push({
  regexp: /@return +(\{ *\w+ *\}) +((\w+ *)*)/,
  generator: function (text, match) {
    return {
      types: match[1].slice(1,-1).split('|'),
      description: match[2]
    };
  }
});

/** 
 * tag @api
 */

redox.tags.push({
  regexp: /@api +(\w+) +((\w+ *)*)/,
  generator: function (text, match) {
    return {
      visibility: match[1]
    };
  }
});


/** 
 * tag @type
 */

redox.tags.push({
  regexp: /@type +(\{ *\w+ *\}) +((\w+ *)*)/,
  generator: function (text, match) {
    return {
      types: match[1].slice(1,-1).split('|')
    };
  }
});

/**
 * snippets
 */

redox.snippets = [];

/**
 * function statement
 */

redox.snippets.push({
  regexp: /^ *function (\w+) *\(/g,
  generator: function (text, match) {
    return {
      type: 'function',
      name: match[1],
      string: match[1] + '()',
      text: text
    };
  }
});

/**
 * function expression
 */

redox.snippets.push({
  regexp: /^ *var *(\w+) *= *function/g,
  generator: function (text, match) {
    return {
        type: 'function',
        name: match[1],
        string: match[1] + '()',
        text: text
    };
  }
});

/**
 * prototype method
 */

redox.snippets.push({
  regexp: /^ *(\w+(\.\w+)*)\.prototype\.(\w+) *= *function/g,
  generator: function (text, match) {
    return {
        type: 'method',
        constructor: match[1],
        name: match[2],
        string: match[1] + '.prototype.' + match[2] + '()',
        text: text
    };
  }
});

/**
 * prototype property
 */

redox.snippets.push({
  regexp: /^ *(\w+(\.\w+)*)\.prototype\.(\w+) *= *([^\n;]+)/g,
  generator: function (text, match) {
    return {
      type: 'property',
      constructor: match[1],
      name: match[2],
      value: match[3],
      string: match[1] + '.prototype' + match[2],
      text: text
    };
  }
}); 

/**
 * method
 */

redox.snippets.push({
  regexp: /^ *(\w+(\.\w+)*) *= *function/g,
  generator: function (text, match) {
    return {
      type: 'method',
      receiver: match[1],
      name: match[2],
      string: match[1] + '.' + match[2] + '()',
      text: text
    };
  }
});

/** 
 * property
 */

redox.snippets.push({
  regexp: /^ *(\w+(\.\w+)*) *= *([^\n;]+)/g,
  generator: function (text, match) {
    return {
      type: 'property',
      receiver: match[1],
      name: match[2],
      value: match[3],
      string: match[1] + '.' + match[2],
      text: text
    };
  }
});

/** 
 * property
 */

redox.snippets.push({
  regexp: /^ *(\w+(\.\w+)*) *= *([^\n;]+)/g,
  generator: function (text, match) {
    return {
      type: 'property',
      receiver: match[1],
      name: match[2],
      value: match[3],
      string: match[1] + '.' + match[2],
      text: text
    };
  }
});