console.log("it's ok");
var socket =  io.connect(location.origin);
let object= null;
let sendId = null;	

const events = ['dragenter', 'dragover', 'dragleave', 'drop', 'dragstart', 'dragend']
function preventDefaults(e) {
    e.preventDefault()
	e.stopPropagation()
}
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
			sound: true,
			history:new Array(),
			preloder: false,
			aboutVis: false,
			sendToAll:false,
			currentRepostMess: null,
			scrollVis: false,
			closeRepostVis: false,
			favorite: false,
			existFav: false,
			editVis: false,
			dropVis: false,
			dragenterBool: false,
			messText: null,
			editMessId: null,
				
		}
	},
	methods:{

		dragenter1(){
			let elem = document.getElementById('assid') 
			elem.classList.add('hover')
			this.dragenterBool = true;
			let img = document.getElementById('docImgId') 
			img.classList.add('himg')
		},	
		dragleave1(){
		
			let elem = document.getElementById('assid') 
			elem.classList.remove('hover')
			let img = document.getElementById('docImgId') 
			img.classList.remove('himg')
			this.dragenterBool = false;
		
		},
		dragenter(){

			//if(this.dragenterBool) return
			this.dropVis = true;	
		
		},
		dragleave(){
		
			if(this.dragenterBool) return
	
			this.dropVis = false;	
		},
		drop(e){
			this.dropVis = false;
			let elem = document.getElementById('assid') 
			elem.classList.remove('hover')
			let img = document.getElementById('docImgId') 
			img.classList.remove('himg')
			this.inputFiles = e.dataTransfer.files
			this.fileVis =true;
		},
		letEdit(editUser){
		
			fetch('/letedit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(editUser)
				
			}).then(res =>  res.ok ? location.reload():res.text())
			.then((data)=>{
				
				if (data =='errlogin') alert('Пользователь с таким именем или логином уже существует!'); else	that.regVis=false;	
				
			});
		},
		openedit(){
			
			this.editVis = true;
			
		}, 
		async favoriteSet(newUserFav){
			this.currentUser  = newUserFav;
			 await fetch('/setfavorite', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(newUserFav)
			}).then(res => res.ok ? location.reload():res.text())
			.then(data=>{
				
			});
			this.existFav = this.currentUser.favorite.includes(this.currentReceptor._id)

		},
		favoriteHandler(){
			this.favorite = !this.favorite;
			localStorage.setItem('favorite', this.favorite);
		
			this.history = new Array()
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
		editmess(mess){
			
			this.messText = mess.text;
			this.editMessId = mess.messId
		},
		fecthEditMessage(){
			let btn = document.getElementById(this.editMessId);
			let currMess = btn.parentNode ;
			currMess.classList.remove('editMessage')
			let text = currMess.querySelector('p')
			text.innerText = this.messText;
			let editmess ={
				id: this.editMessId,
				userId: this.currentUser._id,
				receptorId: this.currentReceptor._id,
				text: this.messText
			}
		
			this.messText = null
			this.editMessId = null
			fetch('/editmess', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				  },
				body: JSON.stringify(editmess)
			}).then(res => res.text())
			.then(data=>{
				//location.reload();
				//alert(data);

			});
		},
		openContacts(){
		
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
			if(this.editMessId!=null){
		
				this.fecthEditMessage()
				return
			}
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
	
			let hours = new Date(date).getHours();
			let minutes = new Date(date).getMinutes();
			if (minutes<10) minutes = '0'+ minutes;
			let day = new Date(date).getDate();
			let month = new Date(date).getMonth() + 1;
			let year = new Date(date).getFullYear();
		
			let as1 ='' +year;
		
			let as2 = as1.slice(2)
		
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
					location.reload()
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
				
			}).then(res =>  res.ok ? location.reload():res.text())
			.then((data)=>{
				console.log(data)
				if (data =='errlogin') alert('Пользователь с таким именем или логином уже существует!'); else	that.regVis=false;	
				
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
						//console.log('===>>',data);
						location.reload();
			});		
		},
		chooseReceptor(receptor){
			//console.log(receptor, this.currentReceptor)
			if (!that.currentUser.hasOwnProperty('favorite')) that.currentUser.favorite = [];
			that=this;	
			that.history=[];
			this.currentReceptor = this.users.find(item=>item._id == receptor);
			this.existFav = this.currentUser.favorite.includes(this.currentReceptor._id)
	
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
			if (this.favorite) 
			console.log(this.currentUser)
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
						if (that.favorite){
							if (!that.currentUser.hasOwnProperty('favorite')) that.currentUser.favorite = [];
							filtredArr = [];
							this.currentUser.favorite.forEach(item1=>{
								let res = data.find(item=>item._id == item1);
								filtredArr.push(res)
							})
							that.users = filtredArr;
							console.log(that.users)
							that.ishodusers = filtredArr;
						} else{
							that.users = data;
					
						that.ishodusers = data;
						} 
						
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
				
				return this.currentUser.name[0]
			}
		}, 
		curRecSymb(){
			if (this.currentReceptor!==null){
				
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
		events.forEach((eventName) => {
			document.body.addEventListener(eventName, preventDefaults)
		})
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
										
				}
			});	

	},
	unmounted(){
		events.forEach((eventName) => {
			document.body.removeEventListener(eventName, preventDefaults)
		})
	}


});
app.component('messag',{
	data(){
		return{
			mess:[],
			fileNames:  null,
			fileData:  null,
			menOpen :false,
			messId: null,
			editText: null,
			
					
		}
	},
	props:['users', 'currentUser','sound', 'history', 'currentreceptor' ],
	emits:['new-mess',  'delete-mess', 'open-fl', 'edit-mess'],
	template: `<div >
				<div  v-for="item in history" v-bind:key="item" v-bind:class=item.class>
					<div class="mess-name">
						<h4>{{item.person}}</h4>
						<p >{{item.message}}</p>
						<div @click="download"  v-if="item.files!=null" class="mess-file" v-for="item1 in item.files"  v-bind:key="item1"> 
							<img  src="./img/doc.png">
							<p>{{item1}}</p>
						</div>
					</div>
					<div class="mess-time" >
						<p>{{item.time}}</p>
						<p>{{item.date}}</p>
					</div>
					<div class="mess-menu" @click="openMenDiv" v-bind:id="item._id" >
						<img src="./img/menuMess.png" class="mess-menu-img">
					</div>
					<div class="mess-click" >
						<div class="mess-delete">
							<img src="./img/editMess.png" class="sender-img" @click="editMess" title="Редактировать сообщение">
						</div>
						<div class="mess-delete">
							<img src="./img/repost.png" class="sender-img" @click="repost" title="Переслать сообщение">
						</div>
						<div class="mess-delete">
							<img src="./img/delete.png" class="sender-img" @click="delmess" title="Удалить сообщение">
						</div>
						<div class="mess-delete">
							<img  src="./img/closeBlue.png" class="sender-img" @click="close" title="Закрыть меню">
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
			if(this.menOpen){
				let mn = document.querySelectorAll('.mess-click')
				mn.forEach(item=>item.style.display="none")
				this.menOpen = false
			}
	
			let mess = null;
			e.target.tagName=='IMG'? mess = e.target.parentNode : mess  = e.target ;
			this.messId = mess.id;
			let menu = mess.nextSibling

			if (this.messId){				
				menu.style.display = 'flex';
				this.menOpen = true;
			} else {
				menu.style.display = 'flex';
				this.menOpen = true;
			}
			
		},

		delmess(e){				
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
			
		},
		editMess(){	
				let btn = document.getElementById(this.messId);
				let currMess = btn.parentNode ;
				if(currMess.className=='mess-in'){
					alert('Редактирвать сообщения других пользователей нельзя!')
					return
				}
				currMess.classList.add('editMessage')
				let text = currMess.querySelector('p')
				this.$emit('edit-mess', {messId: this.messId, text: text.innerText});
				let menu = currMess.querySelector('.mess-click')
				menu.style.display="none"
				this.menOpen=false;
		},
		close(){
			if(this.menOpen){
				let mn = document.querySelectorAll('.mess-click')
				mn.forEach(item=>item.style.display="none")
				this.menOpen = false
			}
		}

	},

	
 });

 app.component('men',{
	props:['menuvis', 'curruser', 'currrecept', 'existfav', 'favorite'],
	emits:['close-open', 'del-hist', 'del-acc','open-about', 'favorite-set', 'open-edit' ],
	template: `
				<div  v-if="menuvis" class="head-menu-list">
					<h4 @click="openlog">{{tet}}</h4>
					<h4 @click="favoriteAdd" v-if="!existfav && currrecept">Добавить контакт в избранное</h4>
					<h4 @click="favoriteDel" v-if="existfav && favorite">Удалить контакт из избранного</h4>
					<h4 @click="delHist" v-if="currrecept">Отчистить историю</h4>
					<h4 @click="openEdit" v-if="curruser">Редактировать свой аккаунт</h4>
					<h4 @click="delAcc" v-if="curruser">Удалить свой аккаунт</h4>
					<h4 @click="openabout">О нас</h4>				
				</div>
				`,
	methods:{
	
		favoriteAdd(){
	
			if (!this.curruser.hasOwnProperty('favorite')) this.curruser.favorite = [];
			this.curruser.favorite.push(this.currrecept._id)
			this.$emit('favorite-set', this.curruser );
		},

		favoriteDel(){
			let index = this.curruser.favorite.indexOf(this.currrecept._id)
			this.curruser.favorite.splice(index)
			this.$emit('favorite-set', this.curruser );
		},
		openlog(){
			this.$emit('open-log');
			
		},
		openEdit(){
			this.$emit('open-edit');
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
				<div v-if="loginvis" class="log" >
					<div class="log-cont-img">
						<img class="log-img" @click="close" src="./img/close.png">
					</div>
					<h3 class="vhod">Вход</h3>
					<div class="log-inputs">
						<input  id="personlog" type="text" @keyup.enter="enter" v-if="curruser==null" placeholder="Введите логин">
						<input type="password" id="pass"  @keyup.enter="enter" v-if="curruser==null" placeholder="Введите пароль">
						<button @click="enter" v-if="curruser==null">Войти</button>
						<button @click="exit" v-if="curruser!==null">Выйти</button>
						<button @click="openReg" v-if="curruser==null">Регистрация</button>
					</div>					
				</div>
				
			
				`,
	methods:{
		close(){
			this.$emit('close-login');
		}, 
		enter(){
			let account={
				login:personlog.value,
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
	emits:['close-reg', 'let-reg'],
	template: `
					<div v-if="regvis" class="fon"></div>	
					<div v-if="regvis" class="log logHight">	
						<div class="log-cont-img">
							<img class="log-img" @click="close" src="./img/close.png">
						</div>
						<h3 class="vhod">Регистрация</h3>
						<div class="log-inputs">
							<input  id="nameId" type="text"  placeholder="Введите имя" >
							<input  id="personreg" type="text"  placeholder="Введите логин" >
							<input type="password" id="pass1" v-if="currentUser==null" placeholder="Введите пароль" >
							<input type="password" id="pass2"  v-if="currentUser==null" placeholder="Подтвердите пароль" >
							<button @click="registration" v-if="currentUser==null">Зарегистрироваться</button>		
						</div>				
					</div>
				
				`,
	methods:{
		close(){
	//	console.log('wdwdwdw')
			this.$emit('close-reg');
		},
		registration(){
			if (nameId.value.length == 0) {alert ("Введите имя!"); return} 
			if (personreg.value.length == 0) {alert ("Введите логин!"); return} 
			if (pass1.value.length == 0) {alert ("Введите пароль!"); return} 
			if (pass2.value.length == 0) {alert ("Введите второй пароль!"); return} 
			
			if (pass1.value == pass2.value ){
				let ps=pass1.value;
				let men = {
					name: nameId.value,
					login: personreg.value,
					password: ps,
					
				}
				this.$emit('let-reg', men);
				
			} else alert ("Пароли не совпадают!")	
		},
	}	
 });

 app.component('edit',{
	props:['editvis', 'curruser'],
	emits:['close-edit', 'let-edit'],
	template: `	<div>
					<div v-if="editvis" class="fon"></div>	
					<div v-if="editvis" class="log logHightEdit">	
						<div class="log-cont-img">
							<img class="log-img" @click="close" src="./img/close.png">
						</div>
						<h3 class="vhod">Редактирвать данные свого аккаунта</h3>
						<div class="log-inputs">
							<label for="name">Текущее имя:</label>
							<input  name="name" id="nameId1" type="text"  placeholder="Введите имя" :value="curruser.name">
							<label for="login">Текущий логин:</label>
							<input  name="login" id="login1" type="text1"  placeholder="Введите логин" :value="curruser.login">
							<label for="pass">Текущий пароль:</label>
							<input  name="pass" type="password" id="pass11"  placeholder="Введите пароль" :value="curruser.password">
							<label for="pass1">Подтверждение текущего пароля:</label>
							<input name="pass1" class="logmarge" type="password" id="pass21"   placeholder="Подтвердите пароль" :value="curruser.password">
							<button @click="letEdit" >Изменить</button>		
						</div>				
					</div>
				</div>
				`,
	methods:{

		close(){
	//	console.log('wdwdwdw')
			this.$emit('close-edit');
		},
		letEdit(){
			if (nameId1.value.length == 0) {alert ("Введите имя!"); return} 
			if (login1.value.length == 0) {alert ("Введите логин!"); return} 
			if (pass11.value.length == 0) {alert ("Введите пароль!"); return} 
			if (pass21.value.length == 0) {alert ("Введите второй пароль!"); return} 
			
			if (pass11.value == pass21.value ){
				let ps=pass11.value;
				let user = {
					name: nameId1.value,
					login: login1.value,
					password: ps,
					
				}
		
				this.$emit('let-edit', user);
				
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
				<input class="contacts-search" id="search"   placeholder="Поиск..." v-on:input="searching" readonly onfocus="this.removeAttribute('readonly')" autocomplete="off">
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
		
			let hours = new Date(date).getHours();
			let minutes = new Date(date).getMinutes();
			if (minutes<10) minutes = '0'+ minutes;
			let day = new Date(date).getDate();
			let month = new Date(date).getMonth() + 1;
			let year = new Date(date).getFullYear();
		
			let as1 ='' +year;
		
			let as2 = as1.slice(2)
		
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
						<h4>Version 2.0.1 </h4>
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