
/* !
 * redox
 * JavaScript RegExp based Doc generator
 * Copyright (c) 2012 Enrico Marino (http://onirame.no.de)
 * MIT License
 */

 !(function (exports) {

  /**
   * Library namespace.
   */

  var redox = exports.redox = {};

  /**
   * Library version.
   */

  redox.version = '0.0.1';

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
    return { text: text };
  };

  /** 
   * Parse tag
   *
   * @api private
   */

  redox.parse.tag = function (text) {
    var rules = redox.rules;
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

  redox.rules = [];

  /**
   * teg @example
   */

  redox.rules.push({
      regexp: /^@example/ 
    , generator: function (text, match) {
        return { text: text };
      }
  });

}(this));