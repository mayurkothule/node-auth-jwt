var express=require('express');

//Initialize express for use
var app=express();
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser=require('body-parser');
var morgan=require('morgan');
var passport=require('passport');

var config=require('./config/main');
var apiRoutes=require('./routes/users');

var port=3000;

//Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//log requests to console
app.use(morgan('dev'));

//Initialize passport for use
app.use(passport.initialize());

//connect to db
const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect(config.database, options);

//Bring in passport stategy
require('./config/passport')(passport);

//Set url for API group routes
app.use('/api',apiRoutes);

//Home route
app.get('/',function(req,res){
  res.send('Relax. We will put the home page here later.');
});

app.listen(port,function(req,res){
  console.log('Your server is running on port '+port+ '... ');
});
