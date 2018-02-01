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
    var source = 'var __r = "";\n';
    source += 'with(data){\n';

    var matcher = RegExp(
        [
            templateSettings.interpolate.source,
            templateSettings.escape.source,
            templateSettings.evaluate.source,
            '(^)(?=.)',
            '(^)', // hack because there is no (?<=) in javascript
            '($)'
        ].join('|'),
        'gm'
    );

    str = str.replace(matcher, function(match, interpolate, escape, evaluate, start, singleLine, end, index) {
        if (interpolate) {
            return '";__r += (' + interpolate + ');__r += "';
        } else if (escape) {
            return '";__r +=  __escape(' + escape + ');__r += "';
        } else if (evaluate) {
            return '";' + evaluate + ';__r += "';
        } else if (start != null) {
            return '__r += "';
        } else if (end != null) {
            return '" + "\\n";';
        } else if (singleLine != null) {
            return '__r += "\\n"';
        }
        return '';
    });
    source += str;
    source += '\n}\n';
    source += 'return __r;\n';
    var handle = new Function('data', '__escape', source);
    var render = function(data) {
        return handle(data, escape);
    };
    return render;
}

module.exports = template;
