import express = require('express')
import { MetricsHandler,Metric } from './metrics'
const path = require('path')
import bodyparser= require('body-parser')
//import head from './views/partials/head'
//import hello from './views/hello'
let ejs = require('ejs')
const app = express()
app.set('views', __dirname + "/../views")
app.set('view engine','ejs');
const port: string = process.env.PORT || '8083'
app.use(express.static(path.join(__dirname, '/../public')))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})
app.get(
  '/hello/:name',
  (req, res) => res.render('hello.ejs', {name:req.params.name})
)
app.get('/hey/:name', (req,res) =>
	res.send("Your name is: "+ req.params.name)
)

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send("It works!")
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getAll(req.params.id, (err: Error | null, data: Metric[] | null) => {
    if (err) throw err
    console.log("Get all!!")
    res.status(200).send(data)
    //res.send("Your metric is: "+ data)
  })
})
/*
app.get('/metrics1/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null, data: Metric[] | null) => {
    if (err) throw err
    console.log("Delete item")
    res.status(200).send(data)
  })
})
*/
app.post('/metrics1/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send("It works!")
  })
})

app.get('/metrics1/:id', (req: any, res: any) => {
  dbMet.getAll(req.params.id, (err: Error | null, data: Metric[] | null) => {
    if (err) throw err
    console.log("Get all!!")
    //res.send("Hi!!")
    res.status(200).send(data)
  })
})

app.get('/metrics11/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null, data: Metric[] | null) => {
    if (err) throw err
    console.log("Delete item")
    res.status(200).send(data)
  })
})
app.post('/metrics11/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send("It works!")
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
