console.log("it's ok");
var socket =  io.connect(location.origin);
let object= null;
let sendId = null;	




const app = Vue.createApp({
	data(){
		return{
			currentUser: null,
			currentReceptor: null,
			users: null,
			ishodusers:null,
			menuVis: false,
			loginVis: false,
			regVis: false,	
			abtVis: false,
			fileVis: false,	
			corrVis:false,
			cookie: null,
			inputFile: null,
			contVis:false,
			backVis:false,
			sound: true,
			history:new Array(),
			preloder: false,
			aboutVis: false,
			sendToAll:false,
			currentRepostMess: null,

		}
	},
	methods:{
		search(src){
			
				if (src.length == 0) this.users = this.ishodusers;
				let arr = this.users.filter(function(item){
				let curr = item.name.toLowerCase();
				let bool = curr.includes(src.toLowerCase())
				//console.log(bool)
				if (bool == true) return true;
			});
			this.users = arr;
		},
		sorty(){
			let ass = new Array();
			ass=this.users;
			ass.sort((a, b)=>a.name -b.name);
			//console.log('sorty result: ', ass);

		},
		repost(messId){
			console.log(messId);
			this.currentRepostMess = this.history.find(item => item._id == messId);			
		},
		reposted(){
			
			this.currentRepostMess=null;
		},
		newmess(data){
			
			//console.log(data);
				
			let tempId = this.currentUser._id;
			let tempId2; 
			if (this.currentReceptor!==null) tempId2=this.currentReceptor._id;
			else  tempId2=null

			if (tempId2==data.senderId)	this.history.push(data)
			if (data.senderId==tempId) this.history.push(data)
			lentaId.scrollTop = lentaId.scrollHeight;
			if (data.senderId==tempId){
			//	console.log('это мое сообщение')
			}else{
				let tempId2; 
				if (this.currentReceptor!==null) tempId2=this.currentReceptor._id;
				else  tempId2=null
				
				if (tempId2!==data.senderId ||tempId2==null ){
					let newMsgImg = document.getElementById(data.senderId+1);
					console.log(newMsgImg);
					newMsgImg.style.display = "flex"
				} 
				
			}
		},
		deletemess(messId){
			console.log(messId)
			delmess ={id: messId}
			fetch('/delmess', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(delmess)
			}).then(res => res.text())
			.then(data=>{
				//location.reload();
				//alert(data);

			});
		},
		openContacts(){
			console.log('кнопка users');
			contactsId.style.display="block";
			lentasenderId.style.display="none";
			contVisId.style.display="none";
			backId.style.display="flex";
		
		},	
		closeContacts(){
			console.log('back');
			contactsId.style.display="none";
			lentasenderId.style.display="flex";
			contVisId.style.display="flex";
			backId.style.display="none";
			
		},	
		addHist(mes){
			console.log('into hist>>>>>>',mes)
			this.history.push(mes)
			console.log(' new hist>>>>>>',this.history)
		},
		submit(){
			//console.log('***', this.currentUser._id);
			
			sendId =null;
			let dataFile =null;
			if (this.currentReceptor == null && this.sendToAll==false) {
				alert("Выберите адресната!")
				return;
			}
			 if (!this.sendToAll) sendId = this.currentReceptor._id;
			
			//Формирование имени файла---
			let fileName = null;
			if (this.inputFile !== null) fileName = this.inputFile.name;
								
			//формирование времени---
			let date  = Date.now();
			console.log('date>>>', Date.now())
			let hours = new Date(date).getHours();
			let minutes = new Date(date).getMinutes();
			if (minutes<10) minutes = '0'+ minutes;
			let day = new Date(date).getDate();
			let month = new Date(date).getMonth() + 1;
			if (month<10) month = '0'+ month;
			let time = `${hours}:${minutes}`;
			let dete = `${day}.${month}`;	
			//Объект сообщения --------------------
			let objectUser = {
				sec:date,
				time: time,
				date: dete,
				person:  this.currentUser.name,
				message: message.value,
				sokId: socket.id,
				senderId: this.currentUser._id,
				receptorId:  sendId,
				file:fileName,
				toAll: this.sendToAll,
			}
			
			//------------------------------------------------
			if (this.inputFile){
			
				this.preloder=true;
					var formData = new FormData();
					formData.append('choosed', this.inputFile);
					fetch('/file', {
						method:'POST',
						body: formData,
						
					}).then(res => console.log(res.text()))
					.then(res=>{console.log('Файл отрававлен!')
									
									this.inputFile = null;
									this.fileVis = false;
									this.preloder=false;
					});	
				}
			socket.emit('message', objectUser);
			let textarea = document.getElementById('message');
			textarea.value='';	
			this.sendToAll = false;
	
		},
		addFile(){
		//	console.log('inputFl');
		that=this;
			let input = document.createElement('input');
			input.type = 'file';
			input.click();
			input.onchange = (e) => {
			/*	if (e.target.files[0].size>2000000000) {
					alert('Выбранный файл не может быть более 2 Гб!');
					return
				}*/
				that.inputFile =  e.target.files[0];
				console.log('==>',e.target.files[0])
				that.fileVis =true;
			};
			

		},
		cancelFile(){
			this.inputFile = null;
			this.fileVis = false;	
		},

		signin(account){
			that = this;
			fetch('/aunt',{
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(account)
			}).then(res =>  res.ok ? res.json():res.text())
			.then(function(data){
				if (data =='errlog') {alert('Неправильный логин или пароль!');
				that.loginVis=true; }
				else {
					console.log(that.currentUser = data[0]);
					
					sendId = that.currentUser._id;
		
					object = {
						senderId:  sendId,
						senderSokId: socket.id,	
					};
				}
			});
			this.loginVis=false;
						
		},
		letReg(user){
			that = this;
			fetch('/letreg', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(user)
				
			}).then(res =>  res.ok ? res.json():res.text())
			.then(function(data){
				if (data =='errlog') alert('Такой пользователь уже существует!'); 
				else {
					console.log(that.currentUser = data[0]);
					that.regVis=false;
					
					location.reload();
										
				}
			});						
		},
		letexit(){
			
			let sendId =null
			if (this.currentUser ==null) return 
			sendId = this.currentUser._id;
		
			let object = {
				senderId:  sendId,
				senderSokId: socket.id,	
			};
		//	console.log('bye', object)
		    socket.emit('bye', object)
			
			this.users = null;
			this.currentUser = null;
			this.currentReceptor = null;
			this.loginVis = false;
		
			fetch('/exit')
				.then(res=>res.text())
					.then(data=>{
						console.log('===>>',data);
						location.reload();
			});	
			////location.reload()		
		},
		chooseReceptor(receptor){
			lentaId.scrollTop = lentaId.scrollHeight;
			that=this;	
			that.history=[];
			this.currentReceptor = this.users.find(item=>item._id == receptor);
			//console.log('>>', this.currentReceptor.history);
			var  histQuery ={
				from: this.currentUser._id,
				who: this.currentReceptor._id
			}
		//	console.log('==>> ', histQuery);
			fetch('/hist', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(histQuery)
			}).then(res =>  res.ok ? res.json():res.text())
			.then(function(data){
				if (data =='errlog') alert('У Вас нет истории собщений с этим пользователем!'); 
				else {
					console.log(that.currentUser.name);
					data.forEach(function(item){
						if (item.senderId!==that.currentUser._id) item.class = "mess-in"; else item.class = "mess-out" 
					});
					that.history = data;
					lentaId.scrollTop = lentaId.scrollHeight;

				};			
			});
		},
		deleteAccount(){
			that=this;
			//console.log("delhacc")
			fetch('/delacc', {
				method:'GET',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
			}).then(res =>  res.text())
			.then(function(data){
				alert(data)
				location.reload();
			 });
		},

		deleteHistory(){
			that=this;
			console.log(this.currentReceptor);
			var  histQuery ={
				from: this.currentUser._id,
				who: this.currentReceptor._id
			}
			//console.log(histQuery);
			
			fetch('/delhist', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(histQuery)
			}).then(res => res.text())
			.then(data=>{
				location.reload();
				alert(data);

			});

			
		}	
	},
	watch:{
		currentUser: function(yang, old){
			let sendId =null
			if (this.currentUser ==null) return 
			sendId = this.currentUser._id;
			console.log('senderSokId',socket.id);
			let object = {
				senderId:  sendId,
				senderSokId: socket.id,	
			};
			console.log('send io ', object)
		//	socket.emit('greeting', object)
			
		}

	},
	computed:{
		soundstat(){
			if (this.sound) return src="./img/soundOn.png"; else  return src="./img/soundOff.png"
		},
		allstat(){
			if (this.sendToAll) return src="./img/allOn.png"; else  return src="./img/allOff.png"
		},
		currentName(){
			that = this;
		//	console.log(this.currentUser)
			if (this.currentUser!==null){
				fetch('/users')		
					.then(res=>res.json())
					.then(data=>{
						
						data.sort(function (a, b) {
							if (a.name > b.name) {
							  return 1;
							}
							if (a.name< b.name) {
							  return -1;
							}
							// a должно быть равным b
							return 0;
						});
						
						that.users = data;
						that.ishodusers = data;
						
						let sendId =null
						if (this.currentUser ==null) return 
						sendId = this.currentUser._id;
						object = {
							senderId:  sendId,
							senderSokId: socket.id,	
						};
						console.log("I send GREETING!", object)
						socket.emit('greeting', object)
					});
				return that.currentUser.name;
				
			}
		},
		curUsSymb(){
			if (this.currentUser!==null){
				//console.log(this.currentUser.name[0])
				return this.currentUser.name[0]
			}
		}, 
		curRecSymb(){
			if (this.currentReceptor!==null){
			//	console.log(this.currentReceptor.name[0])
				return this.currentReceptor.name[0]
			}
		},
		fileName(){
			if (this.inputFile!==null) return this.inputFile.name
		},
	}, 
	mounted(){
		that = this;
		fetch('/users')
		.then(res =>  res.ok ? res.json():res.text())
			.then(function(data){
				if (data !=='errlog') {
					data.sort(function (a, b) {
						if (a.name > b.name) {
						  return 1;
						}
						if (a.name< b.name) {
						  return -1;
						}
						// a должно быть равным b
						return 0;
					});
					that.users = data;
					that.ishodusers = data;
				}else{
					that.loginVis=true;
				}
			});
		fetch('/getuser')
		.then(res =>  res.ok ? res.json():res.text())
			.then(function(data){
				if (data !=='errlog') {
					that.currentUser = data;
					//console.log(that.currentUser)
				}
			});	

	},
	beforeDestroy(){

	},
	
	

});
app.component('messag',{
	data(){
		return{
			mess:[],
			fileName:  null,
			fileData:  null,
			menOpen:false,
			messId: null,
		
			
		}
	},
	props:['users', 'currentUser','sound', 'history', 'currentreceptor' ],
	template: `
				<div  v-for="item in history" v-bind:key="item" v-bind:class=item.class>
					<div class="mess-name">
						<h4>{{item.person}}</h4>
						<p >{{item.message}}</p>
						<div @click="download"  v-if="item.file!==null" class="mess-file">
							<img  src="./img/doc.png">
							<p >{{item.file}}</p>
						</div>
					</div>
					<div class="mess-time" >
						<a>{{item.time}}</a>
						<p>{{item.date}}</p>
					</div>
					<div class="mess-menu" @click="openMenDiv" v-bind:id="item._id" >
						<img src="./img/menuMess.png" class=" mess-menu-img" @click="openMenMenuImg">
					</div>
					<div class="mess-click" >
						<div class="mess-repost">
							<img src="./img/repost.png" class="sender-img" @click="repost">
						</div>
						<div class="mess-delete">
							<img src="./img/delete.png"class="sender-img" @click="delmess"  >
						</div>
					</div>
				</div>
				`,
	created(){
		let that = this;
		
		let filename = null;
		let filedata = null;
		socket.on('message', function (data) {
			console.log('massege=>', data);
			if (socket.id !== data.data.sokId){
				if (that.sound){
					var audioElement = document.createElement('audio');
					audioElement.setAttribute('src', './sounds/notif2.mp3');
					audioElement.muted=false;
					audioElement.play();
				}
			} 
	
			if (data.data.file !==null){
				filename = data.data.file.name;
				filedata = data.data.file.data;			 
			} else {
				filename = null;
				filedata = null;
			} 	
			that.fileName = filename;
			that.fileData = filedata;
		//	console.log(data);
			if (data.data.sokId ==socket.id) data.data.class='mess-out'; else data.data.class='mess-in'; 
		//	console.log(data.data)
			//that.history.push(data.data);
		
			that.$emit('new-mess', data.data);	
			lentaId.scrollTop = lentaId.scrollHeight;
		//	console.log(data)
		})
	},

	methods:{
		download(e){
			that=this;
			console.log(e.target);
			let dlfName = e.target.lastChild.textContent;
			let dlimg =e.target.previousSibling;
			dlimg.src = './img/preloader1.gif';
			
			
			//console.log(typeof dlfName)
			//this.preloder=true;
			fetch('/getfile', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify({name : dlfName}),
			}).then(res =>res.ok? res.blob(): res.text())
			.then(function(result){
				if (typeof result=='string'){
					alert(result)
					dlimg.src = './img/doc.png';
				} else{
					saveAs(result, dlfName)
					dlimg.src = './img/doc.png';
				}					
					
					
				
			});
			
		},

		openMenDiv(e){
			if (!this.menOpen){	
				if (this.messId!==''){
					console.log(e.target);
					let btn = document.getElementById(e.target.id)
					console.log(btn)
					let men = btn.nextSibling;
					men.style.display="flex"
					this.messId = e.target.id;
					this.menOpen=true;
				} else {
					let btn = e.target;
					let men = btn.nextSibling;
					men.style.display="flex"
					this.messId = e.target.id;
					this.menOpen=true;
				}
			} else{
				if (this.messId!==''){	
					console.log(e.target);
					let btn = document.getElementById(e.target.id)
					console.log(btn)
					let men = btn.nextSibling;
					men.style.display="none"
					this.messId = e.target.id;	
					this.menOpen=false;
				}else{
					let btn = e.target;
					let men = btn.nextSibling;
					men.style.display="none"
					this.messId = e.target.id;
					this.menOpen=false;
				}
			} 
			
		},
		openMenMenuImg(e){
			
			if (!this.menOpen){	
				let img = e.target;
				//console.log(img)
				let bt = img.parentElement;
				console.log(bt)
				let men = bt.nextSibling;
				this.messId = bt.id;
				
				men.style.display="flex"
				this.menOpen=true;
			} else{
				let img = e.target;
				//console.log(img)
				let bt = img.parentElement;
				console.log(bt)
				let men = bt.nextSibling;
				men.style.display="none"
				this.messId = bt.id;
				
				this.menOpen=false;
			}
		
		},
		delmess(e){
			//console.log(this.messId)
				
			if (this.messId!==''){
				this.$emit('delete-mess', this.messId);
				let btn = document.getElementById(this.messId);
				let currMess = btn.parentNode ;
				currMess.remove()
				
			} else{
				alert('Для удаления этого сообщения страница будет перезагружена, затем повторите попытку еще раз!')
				location.reload();
			}
		},
		repost(e){
			if (this.messId!==''){
				
			if (contactsId.style.display=="none"){	
				contactsId.style.display="block";
				lentasenderId.style.display="none";
				contVisId.style.display="none";
				backId.style.display="flex";
			} else {
				contactsId.classList.add("contacts2")
			}
			this.$emit('open-fl', this.messId);
				
			} else{
				alert('Для пересылки этого сообщения страница будет перезагружена, затем повторите попытку еще раз!')
				location.reload();
			}
			
		}

	},

	
 });
 app.component('men',{
	props:['menuvis', 'curruser', 'currrecept'],
	template: `
				<div  v-if="menuvis" class="head-menu-list">
					<h4 @click="openlog">{{tet}}</h4>
					<h4 @click="delHist" v-if="currrecept">Отчистить историю</h4>
					<h4 @click="delAcc" v-if="curruser">Удалить аккаунт</h4>
					<h4 @click="openabout">О нас</h4>				
				</div>
				`,
	methods:{
		openlog(){
			this.$emit('open-log');
		},
	
		delHist(){
			if (confirm('Вы действительно хотите удалить ВСЮ историю сообщений с этим пользователем?')==true) this.$emit('del-hist'); else return
		},
	
		delAcc(){
			if (confirm('Вы действительно хотите удалить аккаунт "'+this.curruser.name +'"?')==true) this.$emit('del-acc'); else return
		},
		
		openabout(){
			this.$emit('open-about');
		}
	},
	computed:{
		tet(){
			if (this.curruser==null) return "Войти"; else  return "Выйти"
		}
	}	
 });

 app.component('login',{
	props:['loginvis', 'curruser'],

	template: `<form>
				<div v-if="loginvis" class="log" >
					<div class="log-cont-img">
						<img class="log-img" @click="close"src="./img/close.png">
					</div>
					<div class="log-inputs">
						<input  id="personlog" type="text" @keyup.enter="enter" v-if="curruser==null" placeholder="Введите имя" >
						<input type="password" id="pass" type="text" @keyup.enter="enter" v-if="curruser==null "placeholder="Введите пароль"  >
						<button @click="enter" v-if="curruser==null">Войти</button>
						<button @click="exit" v-if="curruser!==null" >Выйти</button>
						<button @click="openReg" v-if="curruser==null">Регистрация</button>
					<div>					
				</div>
			</form>
				`,
	methods:{
		close(){
			this.$emit('close-login');
		}, 
		enter(){
			let account={
				name:personlog.value,
				password: pass.value
			}
			this.$emit('let-sigin', account);
		},
		exit(){
		
			this.$emit('let-exit');
		},
		openReg(){
			this.$emit('open-reg');
		}
	}	
 });

 app.component('registr',{
	props:['regvis'],
	template: `<form>
				<div v-if="regvis" class="log">
					
						<div class="log-cont-img">
							<img class="log-img" @click="close" src="./img/close.png">
						</div>
						<div class="log-inputs">
							<input  id="personreg" type="text"  placeholder="Введите имя" >
							<input type="password" id="pass1" type="text"v-if="currentUser==null" placeholder="Введите пароль" >
							<input type="password" id="pass2" type="text"v-if="currentUser==null" placeholder="Подтвердите пароль" >
							<button @click="registration" v-if="currentUser==null">Войти</button>
							
						
						<div>
									
				</div>
				</form>	
				`,
	methods:{
		close(){
			this.$emit('close-reg');
		},
		registration(){
			
			if (personreg.value.length == 0) {alert ("Введите имя!"); return} 
			if (pass1.value.length == 0) {alert ("Введите пароль!"); return} 
			if (pass2.value.length == 0) {alert ("Введите второй пароль!"); return} 
			
			if (pass1.value == pass2.value ){
				let ps=pass1.value;
				let men={
					name: personreg.value,
					password: ps,
					
				}
				this.$emit('let-reg', men);
			} else alert ("Пароли не совпадают!")	
		},
	}	
 });

 app.component('contact',{
	props:['users', 'newMessage','curuse',' currentReceptor', 'currmess'],
	data(){
		return{
			lastContact: null,
			activeUsers:null,
		}
	},
	template: `	<input class="contacts-search" id="search" type="text"  placeholder="Поиск..." v-on:input="searching">
				<div v-for="item in users"  v-bind:id="item._id" v-bind:key="item" @click="chooseReceptor" @mouseover="hover" @mouseout="hoverout" class="contacts-item">
					<div  v-bind:id="item._id" class="contacts-item-name">
						{{item.name}}
					</div>
					<div class="contacts-item-newmsg">
						<img v-bind:key="item" v-bind:id="item._id+1" class="contacts-item-newmsg-img" src="./img/newmsg1.png">					
					</div>
					<div class="contacts-item-online" >
						<img  v-bind:key="item" v-bind:id="item._id+0"  @mouseover="hoverln" @mouseout="hoveroutln" class="contacts-item-online-img" src="./img/online.png">
					</div>				
				</div>
				`,
	methods:{
		searching:function(event){
			let src = event.target.value;
			this.$emit('search', src);	
		},
		hover(e){
			let name=document.getElementById(e.target.id);
			if (name.style.color=="red") return; else name.style.color="white"
		},
		hoverout(e){
			let name=document.getElementById(e.target.id);
			if (name.style.color=="red") return; else name.style.color="steelblue"
		},
		hoverln(e){
			let name=e.target.parentElement.parentElement;
			console.log('>>>>>',name)
			if (name.style.color=="red") return; else name.style.color="white"
		},
		hoveroutln(e){
			let name=e.target.parentElement.parentElement;
			console.log('>>>>>',name)
			if (name.style.color=="red") return; else name.style.color="steelblue"
		},
		chooseReceptor(e){
			let newmsgImg = document.getElementById(e.target.id+1);
			if (this.currmess!== null){
				
				let date  = Date.now();
				console.log('date>>>', Date.now())
				let hours = new Date(date).getHours();
				let minutes = new Date(date).getMinutes();
				if (minutes<10) minutes = '0'+ minutes;
				let day = new Date(date).getDate();
				let month = new Date(date).getMonth() + 1;
				if (month<10) month = '0'+ month;
				let time = `${hours}:${minutes}`;
				let dete = `${day}.${month}`;	
			//Объект сообщения --------------------
				let mess = {
					sec:date,
					time: time,
					date: dete,
					person:  this.curuse.name,
					message: this.currmess.message,
					sokId: socket.id,
					senderId: this.curuse._id,
					receptorId:  e.target.id,
					file:this.currmess.file,
					toAll: this.currmess.sendToAll,
				}
				
				socket.emit('message', mess);
				contactsId.classList.remove('contacts2');
				this.$emit('reposted');
				
			}


			newmsgImg.style.display ="none"
		//	console.log('==bk=>>', backId.style.display)
			if (backId.style.display=='flex'){
				contactsId.style.display="none";
				lentasenderId.style.display="flex";
				contVisId.style.display="flex";
				backId.style.display="none";
			}
			if (this.lastContact!==null) {
				let lastC = document.getElementById(this.lastContact);
				
				lastC.style.color="steelblue"
				//lastC.classList.add('contacts-item');
				//lastC.classList.remove('contacts-item2')
			}
			let contact = document.getElementById(e.target.id);
		//	console.log(e.target)
			
			contact.style.color="red"
			//contact.classList.add('contacts-item2' );
			//contact.classList.remove('contacts-item')
			
			this.lastContact = e.target.id;
			console.log()
			this.$emit('choose-receptor', e.target.id);
		}
	},
	created(){
		that = this;
		socket.on('active', function (data) {
			let allContacts =  document.getElementsByClassName('contacts-item');
			let onlIdArr=[]
		
			for (let i=0; i<allContacts.length;i++){			
				  onlIdArr.push (allContacts[i].id+'0');
				  let  onl = document.getElementById(onlIdArr[i]);
				  onl.style.display ="none"					
			}

		
			
			for (let j=0; j<onlIdArr.length;j++){			
				
				data.forEach(elem => {
					if (onlIdArr[j] == elem.senderId+'0'){
						let  onl = document.getElementById(onlIdArr[j]);
						onl.style.display ="flex"
					} 
				});			
			}
						
		});		
		
	},	
 });

 app.component('about',{
	
	template: `
				<div class="log">
					<div class="log-cont-img">
						<img class="log-img" @click="close" src="./img/close.png">
					</div>
					<div class="log-inputs">
						<h1 style="font-family: Aharoni">22ks</h1>
						<br>
						<br>
						<h3>22Kaf-Soft</h3>
						<h3>2021</h3>
						<br>
						<br>				
						<h4>Version 1.0.4 </h4>
					<div>					
				</div>
				`,
	methods:{
		close(){
			this.$emit('close-about');
		},
	}	
 });



app.mount('#app');