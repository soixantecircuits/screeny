var http = require('http')
  , path = require('path')
  , connect = require('connect')
  , express = require('express')
  , app = express();

require('iced-coffee-script/register');

var cookieParser = express.cookieParser('your secret sauce')
  , sessionStore = new connect.middleware.session.MemoryStore();

var BundleUp = require('bundle-up');

BundleUp(app, __dirname + '/assets', {
  staticRoot: __dirname + '/public/',
  staticUrlRoot:'/',
  bundle:false,
  minifyCss: true,
  minifyJs: true
});

var Screens = [],
    port = 3001;
// To actually serve the files a static file
// server needs to be added after Bundle Up

app.configure(function () {
  app.set('views', path.resolve('views'));
  app.set('view engine', 'jade');

  app.use(express.static(__dirname + '/public/'))

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore }));
  app.use(app.router);
});

var server = http.createServer(app)
  , io = require('socket.io').listen(server);

var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

app.get('/', function(req, res) {
  req.session.foo = req.session.foo || 'bar';
  res.render('index');
});

sessionSockets.on('connection', function (err, socket, session) {
  socket.emit('session', session);

  socket.on('foo', function(value) {
    session.foo = value;
    session.save();
    socket.emit('session', session);
  });

  socket.on('addScreen', function(screenInfos){
    Screens.push(screenInfos);
  });

  socket.on("DocumentMouseMove", function(event){
    //socket.emit("mousemove", event);
    socket.broadcast.emit('mousemove', event);

  });

});

server.listen(port);
console.log("Server is running, click here: http://localhost:"+port );