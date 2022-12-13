#!/usr/bin/ruby

list = ENV.to_a.map do |key, value|
  "<li>#{key}: #{value}</li>"
end

response = <<EOS
Content-type: text/html

<html>
  <head>
    <title>CGI Example</title>
  </head>
  <body>
    <div>Hello, CGI!</div>
    <ul>
      #{list.join}
    </ul>
  </body>
</html>
EOS

puts(response)
