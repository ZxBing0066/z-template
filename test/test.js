const template = require('../index');

const compile = template('Hello, <%=name%>, <%=  name  %>, <%= test %>, <%= name + other %>');

const result = compile({
    name: 'world',
    other: 'new world',
    test: null
});

const result2 = template('<div><h1><%= title %></h1><p><%= content %></p></div>')({
    title: 'hello world',
    content: 'this is the content'
});

console.log(compile, result);
console.log(result2);
