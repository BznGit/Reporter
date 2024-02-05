var express = require('express');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const { response } = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var board = require('./settings.json')

var collboardId = null; 
var url = 'mongodb://localhost:27017';
var mongoClient = require('mongodb').MongoClient;

fs.stat('uploads', function(err) {
    if (!err) {
        console.log('[upoads] directory exists');
    }
    else if (err.code === 'ENOENT') {
        console.log('[upoads] directory not exists');
		fs.mkdir('uploads', (err) => {
			if (err) {
			  console.error(err);
			} else {
			  console.log('[upoads] directory created successfully!');
			}
		  });
    }
});

mongoClient.connect(url, function(err, dbs) {
	var db = dbs.db('messeger');
	if(err) return console.log(err);

	let callboard = {
		name:board.callBoardName,
		password:board.password
	}
	var collection = db.collection("users");
	//поиск без параметров
	collection.find({name:board.callBoardName}).toArray((err, results)=>{
		if (results.length == 0){
			collection.insertMany([callboard],(err, result)=>{
				collboardId = callboard._id; 
				dbs.close();
			});	
		} else{
			collboardId = results[0]._id;
			
		} 
	})


});

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/getuser', function(reg, res, next){
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.find({_id:o_id }).toArray((err, results)=>{
			if (results.length!==0){
				//results.forEach(item=>delete item.password)// удаление паролей
				res.send(JSON.stringify(results[0]));
				res.end();
				dbs.close();
			} else {
				res.statusCode=403;
				dbs.close();
				res.send('errlog');
			}
		});
	});
});
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
app.use(multer({storage:storageConfig}).array('choosed'));
app.post('/file', function(reg, res, next){
var ObjectID = require('mongodb').ObjectID;
var o_id = new ObjectID(reg.cookies.ass); 
//var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
mongoClient.connect(url, function(err, dbs){
	var db = dbs.db('messeger');
	var collection = db.collection("users");
	collection.find({_id:o_id }).toArray((err, results)=>{
		if (results.length!==0){
			let filedata = reg.files;
			
			if(!filedata)
				res.send("Ошибка при загрузке файла!");
			else
				res.send("Файл загружен!");
			
			dbs.close();
				
			} else {
				res.statusCode=403;
				dbs.close();
				res.send('errlog');
			}
		});
	});
});


app.post('/getfile', function(reg, res, next){
	let ass = reg.body;
	let filePath = './uploads/'+ass.name;
	fs.access(filePath, (err) => {
		if (err) {
		  console.error(err)
		  res.statusCode = 404;
		  res.end("Этот файл уже удален с сервера!");
		   
		} else{
			var stream = fs.createReadStream(filePath);     
			stream.pipe(res)
		}
	})
   
});

app.post('/hist', function(reg, res, next){

	var histQuery = reg.body;

	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		var id = histQuery.who;

		if(histQuery.who==collboardId){
			collection.find({receptorId: histQuery.who}).toArray((err, results)=>{
				if (results.length!==0){
	
					res.send(JSON.stringify(results));
					res.end();
					dbs.close();
				
				} else {
					res.statusCode=403;
					dbs.close();
					res.send('errlog');
				}
			});
		} else{
				collection.find({$or:[{senderId:histQuery.from, receptorId: histQuery.who}, {senderId:histQuery.who, receptorId:histQuery.from }, {toAll: true}]}).toArray((err, results)=>{
			if (results.length!==0){

				res.send(JSON.stringify(results));
				res.end();
				dbs.close();
			
			} else {
				res.statusCode=403;
				dbs.close();
				res.send('errlog');
			}
		});
		}

	});
});


app.get('/delacc', function(reg, res, next){
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.deleteMany({_id:o_id}),(err, result)=>{
			
			dbs.close();
		};
		
	});
	res.cookie('ass', reg.cookies.ass, { maxAge: 0, httpOnly: true });
	res.send("Пользователь удален!");
	res.end();
});

app.post('/savehist', function(reg, res, next){
	var history = reg.body;
	
	var ObjectID = require('mongodb').ObjectID;
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		collection.insertMany(history, (err, result)=>{
			if (err) console.log('insert db err:>>', err);
		
	   });
	
		dbs.close();
	});
	
	res.send("Сообщение удалено!");
	res.end();
	
});



app.post('/delmess', function(reg, res, next){
	var delMess = reg.body;
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(delMess.id); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
	
		if (collboardId==delMess.receptorId){
			collection.deleteMany({$and:[{_id:o_id}, {senderId:delMess.userId}]},(err, res)=>{	
				if (err) console.log('deleted  mess err:',err);
				
			});
		}else{
			collection.deleteMany({$and:[{_id:o_id}]},(err, res)=>{	
				if (err) console.log('deleted  mess err:',err);
				
			});
		}		
		dbs.close();
	});
	res.send("Сообщение удалено!");
	res.end();
});

app.post('/setfavorite', function(reg, res, next){
	var user = reg.body;
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(user._id); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.updateOne({_id: o_id},{$set:{favorite: user.favorite}},(err, res)=>{	
			if (err) console.log('deleted  mess err:',err);
		});
		dbs.close();
	});
	res.send("Сообщение удалено!");
	res.end();
});


app.post('/delhist', function(reg, res, next){

	var histQuery = reg.body;


	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	if(o_id !=collboardId){
	
		res.send("Вы не можете удалить!");
		res.end();
		return
	}

	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		collection.deleteMany({$or:[{senderId:histQuery.from, receptorId: histQuery.who}, {senderId:histQuery.who, receptorId:histQuery.from }]},(err, res)=>{	
			if (err) console.log('deleted err:',err);
			
		});
		collection.deleteMany({$or:[{senderId:histQuery.from, toAll: true}]},(err, res)=>{	
			if (err) console.log('deleted err:',err);
			
		});
		dbs.close();
	});
	
	res.send("История удалена!");
	res.end();
	
});

app.get('/users', function(reg, res, next){
	//.log('cookei reg:', reg.cookies.ass);
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	//var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.find({_id:o_id }).toArray((err, results)=>{
			if (results.length!==0){
				collection.find().toArray((err, results)=>{
					results.forEach(item=>delete item.password)// удаление паролей
					let me = results.find(item=>item._id == reg.cookies.ass);//поиск себя
					let index = results.indexOf(me); //поиск индекса себя
					results.splice(index, 1)//удаление себя
					res.send(JSON.stringify(results));
					res.end();
					dbs.close();
				})
			} else {
				res.statusCode=403;
				dbs.close();
				res.send('errlog');
			}
		});
	});
});

app.post('/aunt', function(reg, res, next){
	var currentLogin = reg.body;
	var url = 'mongodb://localhost:27017';
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass);
	mongoClient.connect(url, function(err, dbs) {
		var db = dbs.db('messeger');
		if(err) return console.log(err);
		// взаимодействие с базой данных
		var collection = db.collection("users");
		//поиск без параметров
		collection.find({login:currentLogin.login, password:currentLogin.password}).toArray((err, results)=>{
			
			if (results.length==0){
			
				res.statusCode=403;
				res.send('errlog');
				dbs.close();
				return
			}
		
			res.cookie('ass', results[0]._id, { maxAge: 1000*60*60*24, httpOnly: true });
			res.send(JSON.stringify(results));
			res.end();	
		});
	});	
});     

app.post('/letreg', async function(reg, res, next){
	var newUser = reg.body;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs) {
		var db = dbs.db('messeger');
		if(err) return console.log(err);
		// взаимодействие с базой данных
	
		var collection = db.collection("users");
		//поиск без параметров
		collection.find({$or:[{login:newUser.login},{name: newUser.name}]}).toArray((err, results)=>{
			if (results.length == 0){
				
				collection.insertMany([newUser],(err, result)=>{
					
					res.cookie('ass', result.ops[0]._id, { maxAge: 1000*60*60*24, httpOnly: true });
					res.send(JSON.stringify(result.ops[0]));
					res.end();
					dbs.close();
				  });	
			} else {
				console.log('errlogin')
				res.statusCode=403;
				res.send('errlogin');
				dbs.close();
				return										
			}	
		});	
	});
});

app.post('/letedit', async function(reg, res, next){
	var newUser = reg.body;
	let id = reg.cookies.ass;
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass);
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs) {
		var db = dbs.db('messeger');
		if(err) return console.log(err);
		var collection = db.collection("users");
	
		collection.find({$or:[{login:newUser.login}, {name: newUser.name}]}).toArray((err, results)=>{
			console.log(results)
			let index = results.findIndex(item=>item._id == id);
			let arr = results.splice(index, 1)
			if (arr.length != 0){
				collection.updateOne({_id:o_id }, {$set:{name: newUser.name, login: newUser.login, password: newUser.password}},(err, result)=>{
					res.end();
					dbs.close();
				  });	
			} else {
				console.log('errlogin')
				res.statusCode=403;
				res.send('errlogin');
				dbs.close();
				return										
			}	
		});	
	});
})

app.get('/exit', function(reg, res, next){
	res.cookie('ass', reg.cookies.ass, { maxAge: 0, httpOnly: true });
	res.send('cookie deleted!');
	res.end();
});



let rooms=[];

io.on('connection', function (socket){
	socket.on('greeting', function (data){
	
		socket.join(data.senderId);
		if  (rooms.find(item=>item.senderId== data.senderId) !== undefined) return;
		else{
				rooms.push(data);
			
				
			};//поиск индекса себя
		

	});
	setInterval(()=>{ io.emit('active', rooms);},10000)	
	socket.on('bye', function (data){

		let actUser = rooms.find(item=>item.senderId == data.senderId)
		if  (actUser == null) return;
			else {
				rooms.splice(rooms.indexOf(actUser), 1)
				
			};//поиск индекса себя
		
	

	});

	socket.on('message', function (data){
	
		var mongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost:27017';
		mongoClient.connect(url, function(err, dbs){
			var db = dbs.db('messeger');
			var collection = db.collection("history");
			collection.insertMany([data], (err, result)=>{
					if (err) console.log('insert db err:>>', err);
			});
			if (!data.toAll){
				io.to(data.receptorId).to(data.sokId).emit('message',  {data:data})
				
			}else{
				io.emit('message',  {data:data})	
			}
			dbs.close();	
		});
	});
	
	socket.on('disconnect', (reason) => {
	
		let actUser = rooms.find(item=>item.senderSokId == socket.id)

		if  (actUser == null) return;
			else {
				rooms.splice(rooms.indexOf(actUser), 1)
		
				
			};//поиск индекса себя
		
	
	});
	
});


server.listen(5000, ()=>console.log("Reporter server started"));
app.use(express.static('public'));