import express = require('express')
import { Metric, MetricsHandler } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')

const app = express()
const port: string = process.env.PORT || '8082'
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())







const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')  //create or open a levelDB database

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
    //console.log('getAll')
    res.status(200).send(result)
  })
})











const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

import { UserHandler, User } from './user'
import { read } from 'fs'
const dbUser: UserHandler = new UserHandler('./db/users') //create or open a levelDB database
const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  let notFoundErr : string = ""
  let pwdErr : string = ""
  res.render('login.ejs', {notFoundErr : notFoundErr, pwdErr : pwdErr})
})

authRouter.get('/signup', (req: any, res: any) => {
  let existErr : string = ""
  let emptyErr : string = ""
  res.render('signup.ejs', { existErr: existErr, emptyErr : emptyErr})
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.post('/signup', (req: any, res: any, next: any) => {
  console.log("attempt to create an account")
  let existErr : string = ""
  let emptyErr : string = ""

  /*The code below use dbUser.get(...) twice 
  The first use is to check out if the username is already in the database or not
  The second time is to get new user's data to get into its profile page*/
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      //if the username is not found in the db, then display existErr message
      existErr = "Username already exists !"
      res.render('signup.ejs', { existErr: existErr, emptyErr : emptyErr})
    } else if (req.body.username === "" || req.body.email === "" || req.body.password === "") {
      //if one of the fields was empty, then display emptyErr message
      emptyErr = "One of the fields was empty !"
      res.render('signup.ejs', { existErr: existErr, emptyErr : emptyErr})
    } else {
      //all the fields are correct, start to save the new user in db
      let user = new User(req.body.username, req.body.email, req.body.password)
      dbUser.save(req.body, function (err: Error | null) {
        //console.log("SUCCESSFULLY ADDED!!!")
        dbUser.get(req.body.username, (err: Error | null, result?: User) => {
          //console.log(result) 
          if (err) {
            next(err)
          }
          else {
            //console.log("SUCCESSFULLY CONNECTED!!!")
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/')
          }
        })
      })
    }
  })
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  let notFoundErr : string = ""
  let pwdErr : string = ""

  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) {
      next(err)
    }
    //console.log(result) 
    //console.log("pwd : "+ req.body.password)
    if (result === undefined) {
      notFoundErr = "User not found. Unknown username"
      res.render('login.ejs', {notFoundErr : notFoundErr, pwdErr : pwdErr})
    } else if (!result.validatePassword(req.body.password))  {
      pwdErr = "Wrong password. Try again !"
      res.render('login.ejs', {notFoundErr : notFoundErr, pwdErr : pwdErr})
    } else {
      //console.log("SUCCESSFULLY CONNECTED!!!")

      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.post('/delete', (req: any, res: any, next: any) => {
  if (req.body.timestamp >= "0"  && !isNaN(Number(req.body.timestamp))) {
    dbMet.delete(req.session.user.username, req.body.timestamp)
    res.redirect('/')
  }
})

authRouter.post('/add', (req: any, res: any, next: any) => {
  if (req.body.timestamp > "0" && req.body.timestamp !=="" && req.body.value !=="" && !isNaN(Number(req.body.value)) && !isNaN(Number(req.body.timestamp))) {
    dbMet.add(req.session.user.username, req.body.timestamp, req.body.value)
    res.redirect('/')
  }
})

authRouter.post('/convert', (req: any, res: any, next: any) => {
  var time : string = String(new Date(req.body.dateTime).getTime())
  var convert : string = "The timestamp of "+req.body.dateTime+" is : "+time+""
  res.render('index', { name: req.session.user.username, datetime : convert})
})

app.use(authRouter)  //enable the middleware of express.Router()







const userRouter = express.Router()
//FOR ADDING A NEW USER FROM POSTMAN
userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      let user = new User(req.body.username, req.body.email, req.body.password)
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else {
          res.status(201).send("user persisted")
        }
      })
    }
  })
})
//CHECK WHAT I GOT WITH THE KEY USERNAME
userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.use('/user', userRouter)








const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  var time : string = ""
  res.render('index', { name: req.session.user.username, datetime : time})
})

app.use(function(req, res, next){
  res.status(404).render('error.ejs', {port: port});
});

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is running on http://localhost:${port}`)
})