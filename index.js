var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(express.json());


app.use('/reservation', require('./routes/reservation'));

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
