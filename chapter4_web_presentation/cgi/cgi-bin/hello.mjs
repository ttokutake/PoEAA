#!/usr/bin/node

import process from "node:process";

const listItems = Object.keys(process.env).map((key) => {
  const value = process.env[key];
  return `<li>${key}: ${value}</li>`;
});

const response = `
  Content-type: text/html

  <html>
    <head>
      <title>CGI Example</title>
    </head>
    <body>
      <div>Hello, CGI!</div>
      <ul>
        ${listItems.join('')}
      </ul>
    </body>
  </html>
`;

process.stdout.write(response.trim());
