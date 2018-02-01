const template = require('../index');

const compile = template('Hello, <%=name%>, <%=  name  %>, <%= test %>, <%= name + other %>');

const result = compile({
    name: 'world',
    other: 'new world',
    test: null
});

const result2 = template('<div><h1><%= title %></h1><p><%= content %></p></div>')({
    title: '<span>some html</span>hello world',
    content: 'this is the content'
});

console.log(compile, result);
console.log(result2);

const result3 = template('<div><h1><%- title %></h1><p><%- content %></p></div>')({
    title: '<script>alert("xss")</script>hello',
    content: '<script>alert("xss")</script>this is the content'
});

console.log(result3);
