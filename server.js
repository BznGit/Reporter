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


app.use(bodyParser.json());
app.use(cookieParser());

app.get('/getuser', function(reg, res, next){
	console.log('cookei reg:'+reg.cookies.ass);
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.find({_id:o_id }).toArray((err, results)=>{
			if (results.length!==0){
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
app.use(multer({storage:storageConfig}).single('choosed'));
app.post('/file', function(reg, res, next){
var ObjectID = require('mongodb').ObjectID;
var o_id = new ObjectID(reg.cookies.ass); 
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
mongoClient.connect(url, function(err, dbs){
	var db = dbs.db('messeger');
	var collection = db.collection("users");
	collection.find({_id:o_id }).toArray((err, results)=>{
		if (results.length!==0){
			let filedata = reg.file;
			console.log('uploadFile=>',reg.file);
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

	console.log('get file name=>', ass.name);
	let filePath = './uploads/'+ass.name;
	console.log('path=>',filePath)
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
	console.log('cookei reg:', reg.cookies.ass);
	var histQuery = reg.body;

	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		console.log('histQuery.who>>',  histQuery.who);
		var id = histQuery.who;
		collection.find({$or:[{senderId:histQuery.from, receptorId: histQuery.who}, {senderId:histQuery.who, receptorId:histQuery.from }, {toAll: true}]}).toArray((err, results)=>{
			if (results.length!==0){
				console.log('response=>',results);

				res.send(JSON.stringify(results));
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


app.get('/delacc', function(reg, res, next){
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("users");
		collection.deleteMany({_id:o_id}),(err, result)=>{
			console.log('deleted:',results);
			dbs.close();
		};
		
	});
	res.cookie('ass', reg.cookies.ass, { maxAge: 0, httpOnly: true });
	res.send("Пользователь удален!");
	res.end();
});

app.post('/savehist', function(reg, res, next){
	var history = reg.body;
	console.log(history);
	var ObjectID = require('mongodb').ObjectID;
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		collection.insertMany(history, (err, result)=>{
			if (err) console.log('insert db err:>>', err);
			console.log('insert db:>>', result);
	   });
	
		dbs.close();
	});
	
	res.send("Сообщение удалено!");
	res.end();
	
});



app.post('/delmess', function(reg, res, next){
	console.log(reg.body);
	var delMess = reg.body;
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(delMess.id); 
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		collection.deleteMany({_id:o_id},(err, res)=>{	
			if (err) console.log('deleted  mess err:',err);
			console.log('deleted mess:',res);
			
		});
	
		dbs.close();
	});
	
	res.send("Сообщение удалено!");
	res.end();
	
});




app.post('/delhist', function(reg, res, next){
	console.log(reg.body);
	var histQuery = reg.body;
	console.log('cookei reg:', reg.cookies.ass);
	console.log('reg.body:', reg.body);
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs){
		var db = dbs.db('messeger');
		var collection = db.collection("history");
		collection.deleteMany({$or:[{senderId:histQuery.from, receptorId: histQuery.who}, {senderId:histQuery.who, receptorId:histQuery.from }]},(err, res)=>{	
			if (err) console.log('deleted err:',err);
			console.log('deleted hist:',res);
		});
		collection.deleteMany({$or:[{senderId:histQuery.from, toAll: true}]},(err, res)=>{	
			if (err) console.log('deleted err:',err);
			console.log('deleted hist:',res);
		});
		dbs.close();
	});
	
	res.send("История удалена!");
	res.end();
	
});

app.get('/users', function(reg, res, next){
	console.log('cookei reg:', reg.cookies.ass);
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass); 
	var mongoClient = require('mongodb').MongoClient;
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
	//Подключение базы данных ---------------------------
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	var ObjectID = require('mongodb').ObjectID;
	var o_id = new ObjectID(reg.cookies.ass);
	mongoClient.connect(url, function(err, dbs) {
		var db = dbs.db('messeger');
		if(err) return console.log(err);
		// взаимодействие с базой данных
		console.log('Подключились к базе данных Messenger!');
		var collection = db.collection("users");
		//поиск без параметров
		collection.find({name:currentLogin.name, password:currentLogin.password}).toArray((err, results)=>{
			console.log(currentLogin);
			if (results.length==0){
				console.log(results);
				res.statusCode=403;
				res.send('errlog');
				dbs.close();
				return
			}
			console.log('cookie send:', results[0]._id)	
			res.cookie('ass', results[0]._id, { maxAge: 1000*60*60*24, httpOnly: true });
			res.send(JSON.stringify(results));
			res.end();	
		});
	});	
});

app.post('/letreg', function(reg, res, next){
	var newUser = reg.body;
	var mongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017';
	mongoClient.connect(url, function(err, dbs) {
		var db = dbs.db('messeger');
		if(err) return console.log(err);
		// взаимодействие с базой данных
		console.log('Подключились к базе данных Messenger!' + newUser.name);
		var collection = db.collection("users");
		//поиск без параметров
		collection.find({name:newUser.name}).toArray((err, results)=>{
			if (results.length == 0){
				console.log(newUser);
				collection.insertMany([newUser],(err, result)=>{
					console.log('---> ', result.ops[0]);
					res.cookie('ass', result.ops[0]._id, { maxAge: 1000*60*60*24, httpOnly: true });
					res.send(JSON.stringify(result.ops[0]));
					res.end();
					dbs.close();
				  });	
			} else {
				console.log('---++++-> ', results);
				res.statusCode=403;
				res.send('errlog');
				dbs.close();
				return										
			}	
		});	
	});
});

app.get('/exit', function(reg, res, next){
	res.cookie('ass', reg.cookies.ass, { maxAge: 0, httpOnly: true });
	res.send('cookie deleted!');
	res.end();
});



let rooms=[];

io.on('connection', function (socket){
	socket.on('greeting', function (data){
		console.log('greeting:', data);
		socket.join(data.senderId);
		if  (rooms.find(item=>item.senderId== data.senderId) !== undefined) return;
		else{
				rooms.push(data);
				console.log('User ', data.senderSokId, ' added to room!', rooms);
				
			};//поиск индекса себя
		
		console.log('active users:>', rooms);

	});
	setInterval(()=>{ io.emit('active', rooms);},10000)	
	socket.on('bye', function (data){
	console.log('try bye',data.senderId );
		let actUser = rooms.find(item=>item.senderId == data.senderId)
		if  (actUser == null) return;
			else {
				rooms.splice(rooms.indexOf(actUser), 1)
				console.log('User ', actUser.senderSokId, ' deleted from room: ', rooms);
				
			};//поиск индекса себя
		
		console.log(rooms);

	});

	socket.on('message', function (data){
		console.log('--->',  data);
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
				console.log('<-----',{data:data});
			}else{
				io.emit('message',  {data:data})	
			}
			dbs.close();	
		});
	});
	
	socket.on('disconnect', (reason) => {
		console.log('Disconnected user:', socket.id, rooms);
		let actUser = rooms.find(item=>item.senderSokId == socket.id)
		console.log('===>>>>', actUser, 'in room:', rooms);
		if  (actUser == null) return;
			else {
				rooms.splice(rooms.indexOf(actUser), 1)
				console.log('User ', socket.id, ' deleted from room AUTO!', rooms);
				
			};//поиск индекса себя
		
		console.log(rooms);
	});
	
});


server.listen(5000, ()=>console.log("Reporter server started"));
app.use(express.static('public'));