var fs  = require('fs');
var	mime = require('mime');
var formidable = require("formidable");

var	mongo = require('mongodb');
var BSON = mongo.BSONPure;
var dbutils = require('./dbutils');

var mongoUrl = dbutils.getMongoUrl();

exports.start = function(req, res) {
  console.log("Request handler 'start' was called.");   
  fs.readFile('index.html', 'utf-8', function (err, data) {
	  if (err) {return console.dir(err);}
      res.setHeader('Content-Type', 'text/html');
      res.send(data);  	  
  }); 	  
}

exports.download = function(req,res) {
  console.log("Request handler 'download' was called."); 
  
  var fileId = req.params.fileId;
  var fileName = req.params.fileName;
	
  mongo.Db.connect(mongoUrl, function (err, db) {
	var gridStore = new mongo.GridStore(db, fileId, 'r');
	gridStore.open(function(err, gridStore) {
		var stream = gridStore.stream(true);
		stream.on("end", function(err) {  
			db.close();
			res.end();	
		});
		var contentType=mime.lookup(fileName).toString();	
		res.setHeader('Content-Type', contentType);	
		stream.pipe(res);
    }); 	
  }); 
}

exports.upload = function(req,res) {
  console.log("Request handler 'upload' was called."); 
  
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) { 
	mongo.Db.connect(mongoUrl, function (err, db) {
		var idobj=new mongo.ObjectID();		
		var fileId=idobj.toString();		
		var gridStore = new mongo.GridStore(db, fileId, 'w');
		gridStore.writeFile(files.upload.path, function(err, fileInfo) {
			db.collection('material',{safe:true},function(err,collection){  
				fields["fileName"]=files.upload.name;
				fields["fileId"]=fileId;
				collection.insert(fields,{safe:true},function(err,result){	
					fields["_id"]=result._id;
					db.close();					
					res.setHeader('Content-Type', 'text/html');
					res.send(JSON.stringify(fields));
				});	  
			}); 
		});	
    });
  });  
}

exports.getList = function(req, res) {
  console.log("Request handler 'getList' was called."); 	

  readList(res,null);
}

exports.getListByCat = function(req, res) {
  console.log("Request handler 'getListByCat' was called."); 	

  var cat =  req.params.cat;
  readList(res,cat);
}

function readList(res,cat) {
  var qstr = {};
  if (cat!=null) {
	 qstr=eval('({"fileCat" : "'+ cat +'"})');
  };	
	
  mongo.Db.connect(mongoUrl, function (err, db) {
    db.collection('material', function(err, collection) {
      collection.find(qstr).toArray(function(err, items) {
	    //if (err) {return console.dir(err);}
		res.setHeader('Content-Type', 'text/html');
		res.send(JSON.stringify(items));
        db.close();
      });
    });
  });
}

exports.delItem = function(req, res) {
  console.log("Request handler 'delete' was called.");
  var id = req.params.id;

  mongo.Db.connect(mongoUrl, function (err, db) {
    db.collection('material', {safe:true}, function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, doc) {
			var fileName=doc.fileName;
			collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
				if (doc.fileId) {						
					var gridStore=mongo.GridStore; 
					gridStore.unlink(db, doc.fileId, function(err) { 
						console.log('delete '+fileName);	
							db.close();
							readList(res,null);							
					}); 
				} else {
					db.close();
					readList(res,null);				
				};				
			});		

		});	
    });
  });
}

	

