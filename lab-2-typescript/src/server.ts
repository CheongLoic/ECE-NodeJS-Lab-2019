import express = require('express')
import { MetricsHandler } from './metrics'
const path = require('path')

let ejs = require('ejs')
const app = express()
app.set('views', __dirname + "/views")
app.set('view engine','ejs');
const port: string = process.env.PORT || '8080'
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req: any, res: any) => {
  /*res.write('Hello world')
  res.end()*/
  res.render('home.ejs', {})
})

app.get(
  '/hello/:name',
  (req, res) => res.render('hello.ejs', {name:req.params.name})
)

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.use(function(req, res, next){
  res.status(404).render('error.ejs', {});
});

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
