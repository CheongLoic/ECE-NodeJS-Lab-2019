import express = require('express')
import { Metric, MetricsHandler } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')

const app = express()
const port: string = process.env.PORT || '8082'
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.get('/hello/:name', (req: any, res: any) => {
  res.render('hello.ejs', {name: req.params.name})
})

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('ok')
  })
})


app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getAll(
    req.params.id, (err: Error | null, result: Metric[] | null) => {
    if (err) throw err
    console.log('getAll')
    res.status(200).send(result)
  })
})

app.get('/metricsToDelete/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null, data: Metric[] | null) => {
    if (err) throw err
    console.log("Delete item")
    res.status(200).send(data)
  })
})


app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is running on http://localhost:${port}`)
})
