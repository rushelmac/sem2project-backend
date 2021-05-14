// var createError = require('http-errors');
const express = require('express'),
  path        = require('path'),
  mongoose    = require('mongoose'),
  cors        = require('cors'),
  indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users'),
  authRouter  = require('./routes/auth');

// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// For importing credentials and private keys
require('dotenv').config();

// Creating express app
const app = express();

// Using json object readability
app.use(express.json());

// Ensuring jwt private key in the system.
// if(!process.env.WC_jwtPrivateKey){
//   console.error('FATAL ERROR: jwtPrivateKey is not defined');
//   process.exit(1);
// }

//databases connection
const uri = `mongodb+srv://${process.env.Database_Username}:${process.env.Database_Password}@cluster0.jg9l3.mongodb.net/WC-Storage?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Failed to connect...'));


// app.use(logger('dev'));
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Allowing cross origin requests
app.use(cors());

// Using route modules
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// Listening on server port OR port no 5000
const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server is running on ${port}`);
});
