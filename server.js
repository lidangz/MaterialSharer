var express = require('express');
var handlers = require('./handlers');

var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';     // OPENshift and local
var port      = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;  // OPENshift, jae and local

var app = express();
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
console.log ('registering routes with express');

app.get('/', handlers.start);
app.get('/materials', handlers.getList);
app.get('/materials/:cat', handlers.getListByCat);
app.post('/materials', handlers.upload);
app.get('/files/:fileId/:fileName', handlers.download);
app.delete('/materials/:id', handlers.delItem);

console.log ('About to start listening');
if (process.env.OPENSHIFT_NODEJS_IP) {
	app.listen(port,ip_address);
} else {
	app.listen(port);
};	
console.log('Listening on port: ', port, ' of ', ip_address);



