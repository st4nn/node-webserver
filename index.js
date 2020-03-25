var express = require('express'),
	bodyParser = require('body-parser'),
	https = require("https"),
	http = require("http"),
	fs = require("fs"),
	useragent = require('express-useragent'),
	expressip = require('express-ip'),
  	app = express(),
	port = process.env.PORT || 4000;
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);

let httpServer = null;

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"){
	const options = {
		key: fs.readFileSync("/apps/certifies/private.key"),
		cert: fs.readFileSync("/apps/certifies/certificate.crt")
	};
	
	httpServer = https.createServer(options, app);
} else{
	httpServer = http.createServer({}, app);
}

httpServer.listen(port, ()=>{
	console.log('Web Server started on: ' + port + ' ' + process.env.NODE_ENV);
});



app.use(express.static('../wsc-webrtc-encoder'));

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});
