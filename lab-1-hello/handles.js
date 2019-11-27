const url = require('url')
const qs = require('querystring')

const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'         <p>Hello, you are in 2nd work !</p>' +
'         <p>You are now at http://localhost:8080/</p>' +
'         <p>This page will explain you how <strong>/hello </strong> works</p>' +
'         <p>Go to the page http://localhost:8080/hello?name=<strong>YourName</strong></p>' +
'         <p><strong>name</strong> is a parameter and <strong>YourName</strong> is the value of this parameter</p>' +
'         <p>Instead of <strong>YourName</strong>, replace it by your own name like <a href="http://localhost:8080/hello?name=William">http://localhost:8080/hello?name=William</a></p>' +
'         <p>It will redirect you to a new page and display a message : "Hello William, you are an engineering student at ECE !"</p>' +
'         </br>' +
'         <p>If you try to go to an unknown link like <a href="http://localhost:8080/hello">http://localhost:8080/hello</a>, it will display you an error message</p>' +
'    </body>' +
'</html>'



module.exports = {
    serverHandle : function (req, res) {
      const route = url.parse(req.url)
      const path = route.pathname 
      const params = qs.parse(route.query)
  
      res.writeHead(200, {'Content-Type': 'text/html'});
      if (path == '/') {
        res.write(content);
      }
      else if (path === '/hello' && 'name' in params) {
        res.write('<p>Hello ' + params['name'] + ', you are an engineering student at ECE !</p>')
        
      } else {
        res.write('<h1><strong>404 PAGE NOT FOUND !</strong></h1>')
      }
      res.end();
    }
}