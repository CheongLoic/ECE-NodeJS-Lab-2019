"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var path = require("path");
var bodyparser = require("body-parser");
var app = express();
var port = process.env.PORT || '8082';
app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.get('/', function (req, res) {
    res.write('Hello world');
    res.end();
});
app.get('/hello/:name', function (req, res) {
    res.render('hello.ejs', { name: req.params.name });
});
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send('ok');
    });
});
/*app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})*/
app.get('/metrics/:id', function (req, res) {
    dbMet.getAll(req.params.id, function (err, result) {
        if (err)
            throw err;
        console.log('getAll');
        res.status(200).send(result);
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("Server is running on http://localhost:" + port);
});
