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
			inputFiles: null,
			contVis:false,
			backVis:false,
			sound: null,
			history:new Array(),
			preloder: false,
			aboutVis: false,
			sendToAll:false,
			currentRepostMess: null,
			scrollVis: false,
			closeRepostVis: false,
			favorite: false,
			existFav: false,
				
		}
	},
	methods:{
		favoriteAdd(newUserFav){
			this.currentUser  = newUserFav;
			fetch('/setfavorite', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(newUserFav)
			}).then(res => res.text())
			.then(data=>{
				//location.reload();
				//alert(data);
			});

		},
		favoriteHandler(){
			this.favorite = !this.favorite;
			localStorage.setItem('favorite', this.favorite);
		},
		soundHandler(){
			this.sound = !this.sound;
			localStorage.setItem('sound', this.sound)
		},
		search(src){
			if (src.length == 0) this.users = this.ishodusers;
			let arr = this.users.filter(function(item){
				let curr = item.name.toLowerCase();
				let bool = curr.includes(src.toLowerCase())
				if (bool == true) return true;
			});
			this.users = arr;
		},
		sorty(){
			let ass = new Array();
			ass=this.users;
			ass.sort((a, b)=>a.name - b.name);
		},
		repost(messId){
			console.log(close);
			this.currentRepostMess = this.history.find(item => item._id == messId);	
		},
		reposted(closeVis){
			this.closeRepostVis = closeVis;
			this.currentRepostMess=null;
		},
		newmess(data){	
			let tempId = this.currentUser._id;
			let tempId2; 
			if (this.currentReceptor!==null) tempId2=this.currentReceptor._id;
			else  tempId2=null
			if (tempId2==data.senderId)	this.history.push(data)
			if (data.senderId==tempId) this.history.push(data)
			lentaId.scrollTo(0, lentaId.scrollHeight);
			if (data.senderId==tempId){
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

			delmess ={
				id: messId,
				userId: this.currentUser._id,
				receptorId: this.currentReceptor._id
			}
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
		//	console.log('кнопка users');
			contactsId.style.display="block";
			lentasenderId.style.display="none";
			contVisId.style.display="none";
			backId.style.display="flex";
		
		},	
		closeContacts(){
		//	console.log('back');
			contactsId.style.display="none";
			lentasenderId.style.display="flex";
			contVisId.style.display="flex";
			backId.style.display="none";
			
		},
		closeRepost(e){
			contactsId.classList.remove('contacts2');
			contClsId.style.display="none"

			
		},
		addHist(mes){
		//	console.log('into hist>>>>>>',mes)
			this.history.push(mes)
		//	console.log(' new hist>>>>>>',this.history)
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
			
			//Формирование имен файлов ------------------------------------------------------------
			if (this.inputFiles != null){
				let fileName = [];
				for(let i = 0; i < this.inputFiles.length; i++){
					fileName.push(this.inputFiles[i].name);
				}
			} 
					
			//формирование времени ----------------------------------------------------------------
			let date  = Date.now();
			console.log('date>>>', Date.now())
			let hours = new Date(date).getHours();
			let minutes = new Date(date).getMinutes();
			if (minutes<10) minutes = '0'+ minutes;
			let day = new Date(date).getDate();
			let month = new Date(date).getMonth() + 1;
			let year = new Date(date).getFullYear();
			console.log(year);
			let as1 ='' +year;
			console.log(typeof(as1))
			let as2 = as1.slice(2)
			console.log(as2)
			if (month<10) month = '0'+ month;
			let time = `${hours}:${minutes}`;
			let dete = `${day}.${month}.${as2}`;	
			//Объект сообщения --------------------------------------------------------------------
			let objectUser = {
				sec:date,
				time: time,
				date: dete,
				person:  this.currentUser.name,
				message: message.value,
				sokId: socket.id,
				senderId: this.currentUser._id,
				receptorId:  sendId,
				files:this.fileName,
				toAll: this.sendToAll,
			}
			
			//------------------------------------------------
			if (this.inputFiles){
				this.preloder=true;
				var formData = new FormData();	
				for(let i=0; i < this.inputFiles.length; i++){
					formData.append('choosed',this.inputFiles[i], this.inputFiles[i].name)
				}
		
				fetch('/file', {
					method:'POST',
					body: formData,	
				}).then(res => console.log(res.text()))
				.then(res=>{console.log('Файл отрававлен!')			
					this.inputFiles = null;
					this.fileVis = false;
					this.preloder=false;
				});	
			}
			socket.emit('message', objectUser);
			setTimeout(()=>{lentaId.scrollTo(0, lentaId.scrollHeight)}, 500);
			let textarea = document.getElementById('message');
			textarea.value='';	
			this.sendToAll = false;
			
		},
		addFile(){

			that=this;
			let input = document.createElement('input', );
			input.type = 'file';
			input.setAttribute('multiple','')
			input.click();
			input.onchange = (e) => {
				that.inputFiles =  e.target.files;
				that.fileVis =true;
			};		
		},
		cancelFile(){
			this.inputFiles = null;
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
					
					sendId = that.currentUser._id;
		
					object = {
						senderId:  sendId,
						senderSokId: socket.id,	
						
					};
				}
				
			});
			this.loginVis=false;
			setTimeout(() => {
				location.reload()
			}, 1000); 
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
				if (data =='errlog') alert('Такой пользователь уже существует!'); else	that.regVis=false;	
							
			});
			setTimeout(() => {
				location.reload()
			}, 1000); 
							
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
						//console.log('===>>',data);
						location.reload();
			});		
		},
		chooseReceptor(receptor){
			//
			that=this;	
			that.history=[];
			this.currentReceptor = this.users.find(item=>item._id == receptor);
			this.existFav = this.currentUser.favorite.find(item=>item==this.currentReceptor._id)
			console.log('>>', this.currentReceptor);
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
				//	console.log(that.currentUser.name);
					data.forEach(function(item){
						if (item.senderId!==that.currentUser._id) item.class = "mess-in"; else item.class = "mess-out" 
					
					});
					that.history = data;
					lentaId.scrollTop==lentaId.scrollHeight;
					
				};			
			}).then(()=>{
				lentaId.scrollTo(0, lentaId.scrollHeight);
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
			//console.log(this.currentReceptor);
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
		},

		letDown(){	
			lentaId.scrollTo(0, lentaId.scrollHeight);
		}, 

		onScroll(e){
			if (Math.trunc(lentaId.scrollTop) == Math.trunc(lentaId.scrollHeight-lentaId.offsetHeight)) this.scrollVis = false; else this.scrollVis = true;
		}	
	},
	watch:{
		currentUser: function(yang, old){
			let sendId =null
			if (this.currentUser ==null) return 
			sendId = this.currentUser._id;
			let object = {
				senderId:  sendId,
				senderSokId: socket.id,	
			};			
		},
	},
	computed:{
		favoriteStat(){
			if (this.favorite)  return  src="./img/offFavorite.png"; else  return src="./img/onFavorite.png";
		},
		soundstat(){
			if (this.sound)  return  src="./img/soundOn.png"; else  return src="./img/soundOff.png";
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
					//	console.log("I send GREETING!", object)
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
			if (this.inputFiles != null){
				let fileName = [];
				for(let i = 0; i < this.inputFiles.length; i++){
					fileName.push(this.inputFiles[i].name);
				}
				return  fileName
			} 
		},
	}, 
	mounted(){
		this.sound =  JSON.parse(localStorage.getItem('sound'));
		this.favorite =  JSON.parse(localStorage.getItem('favorite'));
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
					console.log('------->',that.currentUser)
					
				}
			});	

	},


});
app.component('messag',{
	data(){
		return{
			mess:[],
			fileNames:  null,
			fileData:  null,
			menOpen :false,
			messId: null,
					
		}
	},
	props:['users', 'currentUser','sound', 'history', 'currentreceptor' ],
	emits:['new-mess',  'delete-mess', 'open-fl', ],
	template: `<div>
				<div  v-for="item in history" v-bind:key="item" v-bind:class=item.class>
					<div class="mess-name">
						<h4>{{item.person}}</h4>
						<p >{{item.message}}</p>
						<div @click="download"  v-if="item.files!=null" class="mess-file" v-for="item1 in item.files"  v-bind:key="item1"> 
							<img  src="./img/doc.png">
							<p >{{item1}}</p>
						</div>
					</div>
					<div class="mess-time" >
						<p>{{item.time}}</p>
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
							<img src="./img/delete.png" class="sender-img" @click="delmess">
						</div>
					</div>
				</div>
				</div>
				`,
	created(){
		let that = this;
		
		let fileNames = null;
		//let filedata = null;
		socket.on('message', function (data) {
		console.log('massege=>', data);
			if (socket.id !== data.data.sokId){
				if (that.sound){
					var audioElement = document.createElement('audio');
					audioElement.setAttribute('src', './sounds/notif2.mp3');
					audioElement.muted=false;
					audioElement.play();
					lentaId.scrollTo(0, lentaId.scrollHeight);
				}
			} 
	
			if (data.data.files != null){
				console.log('551>>',data.data.files)
				fileNames = data.data.files;
				//filedata = data.data.file.data;			 
			} else {
				fileNames = null;
		
			} 	
			that.fileNames = fileNames;

			if (data.data.sokId ==socket.id) data.data.class='mess-out'; else data.data.class='mess-in'; 
	
			that.$emit('new-mess', data.data);	
			lentaId.scrollTo(0, lentaId.scrollHeight);
		//	console.log(data)
		})
	},

	methods:{
		download(e){
			that=this;
		//	console.log(e.target);
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
				//	console.log(e.target);
					let btn = document.getElementById(e.target.id)
				//	console.log(btn)
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
				//	console.log(e.target);
					let btn = document.getElementById(e.target.id)
				//	console.log(btn)
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
			//	console.log(bt)
				let men = bt.nextSibling;
				this.messId = bt.id;
				
				men.style.display="flex"
				this.menOpen=true;
			} else{
				let img = e.target;
				//console.log(img)
				let bt = img.parentElement;
			//	console.log(bt)
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
			let closeVis=null;
			if (this.messId!==''){
				
			if (contactsId.style.display=="none"){	
				contactsId.style.display="block";
				lentasenderId.style.display="none";
				contVisId.style.display="none";
				backId.style.display="flex";
			
			} else {
				contactsId.classList.add("contacts2");
				contClsId.style.display="flex"
						
				
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
	props:['menuvis', 'curruser', 'currrecept', 'existfav'],
	emits:['close-open', 'del-hist', 'del-acc','open-about' ],
	template: `
				<div  v-if="menuvis" class="head-menu-list">
					<h4 @click="openlog">{{tet}}</h4>
					<h4 @click="favoriteAdd" v-if="!existfav">Добавить в избранное</h4>
					<h4 @click="favoriteHandler" v-if="existfav">Удалить из избранного</h4>
					<h4 @click="delHist" v-if="currrecept">Отчистить историю</h4>
					<h4 @click="delAcc" v-if="curruser">Удалить аккаунт</h4>
					<h4 @click="openabout">О нас</h4>				
				</div>
				`,
	methods:{
		favoriteAdd(){
			console.log('1>', this.curruser)
			if (!this.curruser.hasOwnProperty('favorite')) this.curruser.favorite = [];
			let exist = this.curruser.favorite.find(item=>item==this.currrecept._id)
			if(exist) alert('У Вас он уже жобавден!');
			 this.curruser.favorite.push(this.currrecept._id)
			console.log('2>',this.curruser)
			this.$emit('favorite-add', this.curruser );
		},
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
	emits:['close-login', 'let-sigin', 'let-exit', 'open-reg'],
	template: `
			<div v-if="loginvis" class="fon"></div>	
				<form>
					<div v-if="loginvis" class="log" >
						<div class="log-cont-img">
							<img class="log-img" @click="close" src="./img/close.png">
						</div>
						<h3 class="vhod">Вход</h3>
						<div class="log-inputs">
							<input  id="personlog" type="text" @keyup.enter="enter" v-if="curruser==null" placeholder="Введите имя">
							<input type="password" id="pass"  @keyup.enter="enter" v-if="curruser==null" placeholder="Введите пароль">
							<button @click="enter" v-if="curruser==null">Войти</button>
							<button @click="exit" v-if="curruser!==null">Выйти</button>
							<button @click="openReg" v-if="curruser==null">Регистрация</button>
						</div>					
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
	emits:['close-reg'],
	template: `<form>
					<div v-if="regvis" class="fon"></div>	
					<div v-if="regvis" class="log">	
						<div class="log-cont-img">
							<img class="log-img" @click="close" src="./img/close.png">
						</div>
						<h3 class="vhod">Регистрация</h3>
						<div class="log-inputs">
							<input  id="personreg" type="text"  placeholder="Введите имя" >
							<input type="password" id="pass1" v-if="currentUser==null" placeholder="Введите пароль" >
							<input type="password" id="pass2"  v-if="currentUser==null" placeholder="Подтвердите пароль" >
							<button @click="registration" v-if="currentUser==null">Войти</button>		
						</div>				
					</div>
				</form>	
				`,
	methods:{
		close(){
	//	console.log('wdwdwdw')
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
	props:['users', 'newMessage','curuse','currentReceptor', 'currmess', 'closeRepostVis'],
	emits:['close-repost', 'search', 'message', 'choose-receptor','reposted'],
	data(){
		return{
			lastContact: null,
			activeUsers:null,
		
			
		}
	},
	template: `	<div id="contClsId" class="closed">
					<img class="log-img" @click="close" src="./img/closeBlue.png">
				</div>
				<input class="contacts-search" id="search"   placeholder="Поиск..." v-on:input="searching">
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
		close(){
			this.$emit('close-repost');
		}, 
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
		//	console.log('>>>>>',name)
			if (name.style.color=="red") return; else name.style.color="white"
		},
		hoveroutln(e){
			let name=e.target.parentElement.parentElement;
		//	console.log('>>>>>',name)
			if (name.style.color=="red") return; else name.style.color="steelblue"
		},
		chooseReceptor(e){
			if (lentaId.scrollTop != lentaId.scrollHeight) this.scrollVis = true; else this.scrollVis = false;
			let newmsgImg = document.getElementById(e.target.id+1);
			if (this.currmess != null){
				
	
			//формирование времени ----------------------------------------------------------------
			let date  = Date.now();
			console.log('date>>>', Date.now())
			let hours = new Date(date).getHours();
			let minutes = new Date(date).getMinutes();
			if (minutes<10) minutes = '0'+ minutes;
			let day = new Date(date).getDate();
			let month = new Date(date).getMonth() + 1;
			let year = new Date(date).getFullYear();
			console.log(year);
			let as1 ='' +year;
			console.log(typeof(as1))
			let as2 = as1.slice(2)
			console.log(as2)
			if (month<10) month = '0'+ month;
			let time = `${hours}:${minutes}`;
			let dete = `${day}.${month}.${as2}`;
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
					files:this.currmess.files,
					toAll: this.currmess.sendToAll,
				}
				
				socket.emit('message', mess);
				contactsId.classList.remove('contacts2');
				contClsId.style.display="none"
				
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
		//	console.log()
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
	computed:{
		closeVis(){
			return this.closeRepostVis;
		}
	}
 });

 app.component('about',{
	emits:['close-about'],
	template: `
				<div class="log">
					<div class="log-cont-img">
						<img class="log-img" @click="close" src="./img/close.png">
					</div>
					<div class="log-inputs">
						<h1 style="font-family: Aharoni"></h1>
						<br>
						<br>
						<h3>Bzn-Soft</h3>
						<h3>2024</h3>
						<br>
						<br>				
						<h4>Version 1.0.6 </h4>
					</div>					
				</div>
				`,
	methods:{
		close(){
			this.$emit('close-about');
		},
	}	
 });



app.mount('#app');