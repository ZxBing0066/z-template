var templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};

var trim = function(str) {
    if (typeof str === 'string') {
        if (str.trim) return str.trim();
        return str.replace(/^[\s]+|[\s]+$/g, '');
    }
    return str;
};

function template(str) {
    var source = 'var __t,__r;\n';
    source += 'with(data){\n__r = "';
    str = str.replace(templateSettings.interpolate, function(match, expression) {
        return '" + (' + expression + ') + "';
    });
    source += str;
    source += '"\n}\n';
    source += 'return __r;\n';
    const render = new Function('data', source);
    return render;
}

module.exports = template;
