var mongostr = {                 // local machine
		"hostname":"localhost", 
		"port":27017, 
		"username":"test", 
		"password":"1234",  
		"name":"", 
		"db":"course" 
}

if(process.env.PORT){             // jd cloud
	mongostr = { 
		"hostname":"10.0.31.21", 
		"port":27017, 
		"username":"H8a97QJH", 
		"password":"0R0m5E9j9N32",  
		"name":"", 
		"db":"lidangzm_mongo_1xv73077" 
	}
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
