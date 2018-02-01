var templateSettings = {
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g
};

var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};

var getKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
};

var escapeKeys = getKeys(escapeMap);
var escapeRegExp = (function() {
    var source = '(' + escapeKeys.join('|') + ')';
    return RegExp(source, 'g');
})();

var escaper = function(str) {
    return escapeMap[str];
};

var escape = function(str) {
    return str.replace(escapeRegExp, escaper);
};

function template(str) {
    var source = 'var __t,__r;\n';
    source += 'with(data){\n__r = "';

    var matcher = RegExp(
        [templateSettings.interpolate.source, templateSettings.escape.source, templateSettings.evaluate.source].join(
            '|'
        ),
        'g'
    );

    str = str.replace(matcher, function(match, interpolate, escape, evaluate, index) {
        if (interpolate) {
            return '" + (' + interpolate + ') + "';
        } else if (escape) {
            return '" + __escape(' + escape + ') + "';
        } else if (evaluate) {
            return 'evaluate';
        } else {
            return '';
        }
    });
    source += str;
    source += '"\n}\n';
    source += 'return __r;\n';
    var handle = new Function('data', source);
    var render = function(data) {
        var cachedEscape, hasEscape;
        if ('__escape' in data) {
            cachedEscape = data.__escape;
            data.__escape = escape;
            hasEscape = true;
        }
        data.__escape = escape;
        var result = handle(data);
        if (hasEscape) {
            data.__escape = cachedEscape;
        } else {
            delete data.__escape;
        }
        return result;
    };
    return render;
}

module.exports = template;
