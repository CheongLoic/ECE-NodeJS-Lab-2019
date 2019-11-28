path= require('path')
express= require('express')
metrics =require('./metrics')
app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.get(
  '/hello/:name',
  (req, res) => res.render('hello.ejs', {name:req.params.name})
)
app.get('/', function(req,res) {
	res.send("You are one the main page!")
})
app.get('/hey/:name', (req,res) =>
	res.send("Your name is: "+ req.params.name)
)
/*app.post('/hehe/:name', function (req, res) {
	response = {
       first_name:req.params.name
   };  s
   console.log(response);
  res.send('POST request to the homepage')
})
*/
app.get('/metrics.json', (req, res) => {
  metrics.get((err, data) => {
    if(err) throw err
    res.status(200).json(data)
  })
})
app.set('views', __dirname + "/views")
app.set('view engine','ejs');
app.set('port',8080)
app.listen(
	app.get('port'),
	() => console.log("server listening on ${app.get('port')}")
	)
