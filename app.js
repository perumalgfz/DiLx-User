var createError = require('http-errors');
const express = require('express');
const app = express();

require('dotenv').config();
var flash = require('express-flash');
var session = require('express-session');

global.globalJwtToken = '';

const bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());


var path = require('path');
var logger = require('morgan');


app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());


require('./api/routes/user.routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8080, () => console.log(`Example app listening on port ${8080}!`));