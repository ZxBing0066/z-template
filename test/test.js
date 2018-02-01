const template = require('../index');

const compile = template('Hello, <%=name%>, <%=  name  %>, <%= test %>, <%= name + other %>');

const result1 = compile({
    name: 'world',
    other: 'new world',
    test: null
});

console.log(result1);

const result2 = template('<div><h1><%= title %></h1><p><%= content %></p></div>')({
    title: '<span>some html</span>hello world',
    content: 'this is the content'
});

console.log(result2);

const result3 = template('<div><h1><%- title %></h1><p><%- content %></p></div>')({
    title: '<script>alert("xss")</script>hello',
    content: '<script>alert("xss")</script>this is the content'
});

console.log(result3);

const result4 = template(`
<div>
    <% items.forEach(function(item) { %>
        <li><%= item %></li>
    <% }) %>
</div>
`)({
    items: ['li1', 'li2', 'li3', 'li4']
});

console.log(result4);
