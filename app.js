var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//setup passportjs
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

//setup firebase
var admin = require('firebase-admin');
var serviceAccount = require('./configs/diplom-cf1d1-firebase-adminsdk-8512w-2a2ca11e7e.json');
//routes
var indexRouter = require('./routes/api');
var usersRouter = require('./routes/test');

var dotenv=require('dotenv');
dotenv.config();

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport strategies /////http://www.passportjs.org/packages/passport-google-oauth20/
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://www.example.com/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));



//firebase
//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount)
//});

//routes for API
app.use('/api', indexRouter);
app.use('/test', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
  console.log("connected to MONGODB");
})
.catch(()=>{
  console.log("errors in database /database settings");
})

module.exports = app;
