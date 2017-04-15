/**
 * Created by Larry on 17-4-15.
 */
process.on('uncaughtException',function (err) {
    console.error("uncaughtException:",err.message);
    console.error(err.static);
    process.exit(1);
});

var express = require("express");
var argv = require("optimist").argv;
var session = require("express-session");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var swig = require('swig-templates');

var config = require("./config/config");

var PORT = argv.port || 8088;

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(config.cookie.secret));
app.use(session(config.session));

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', true);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!


app.use("/public",express.static("public"));

app.use(function (req,res,next) {
    res.sendStatus(404);
});


app.use(function (err,req,res,next) {
    console.log(err);
    res.send({result:"error"});
});

app.listen(PORT,function () {
    console.log("server is running at port :" ,PORT);
});