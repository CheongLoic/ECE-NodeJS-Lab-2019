"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var path = require('path');
var ejs = require('ejs');
var app = express();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
var port = process.env.PORT || '8080';
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.write('Hello world');
    res.end();
});
app.get('/hello/:name', function (req, res) { return res.render('hello.ejs', { name: req.params.name }); });
app.get('/hey/:name', function (req, res) {
    return res.send("Your name is: " + req.params.name);
});
app.get('/metrics.json', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
