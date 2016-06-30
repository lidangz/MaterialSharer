var mongostr = {                 // local machine
		"hostname":"localhost", 
		"port":27017, 
		"username":"", 
		"password":"",  
		"name":"", 
		"db":"course" 
}

if(process.env.OPENSHIFT_NODEJS_PORT){     // OPENshift
	mongostr = { 
		"hostname":process.env.OPENSHIFT_MONGODB_DB_HOST, 
		"port":process.env.OPENSHIFT_MONGODB_DB_PORT, 
		"username":process.env.OPENSHIFT_MONGODB_DB_USERNAME, 
		"password": process.env.OPENSHIFT_MONGODB_DB_PASSWORD,  
		"name":"", 
		"db":"mycourse" 
	}
}

function getMongoUrl(){ 
   var obj=	mongostr;
   if(obj.username && obj.password){ 
     return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db; 
   } else{ 
      return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db; 
   } 
} 

exports.getMongoUrl = getMongoUrl;
