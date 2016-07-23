document.addEventListener("DOMContentLoaded",player , false);
// var init
var playlist , audio , dir , titleName , seek,img ,id , playbtn , seekOut ,
next , prev ;

function player() {


	/*
	ajax е вече създаден когато импортваме ajax.js
	( media.js трябва да е след ajax.js)

	пращам заявка за плейлиста от сървара и го получавам като
	json  формат и го парсвам към js обект

	** вар playlist е извън player() метода за да може да се вижда и от
	другите методи

	*/
	Ajax.request('POST', 'ajax.php', true, function(response) {


		playlist = JSON.parse(response);

		// викам метода в рекуеста за да съм сиг че плейлиста
		// е създаден вече
		createPlaylist();
		createAudioObject();
		// слагам го тук защото инече се изпълнява преди да се направи аудио обекта
		audio.addEventListener("timeupdate", function(){ seektimeupdate(); });
	});

	// set object ref

	titleName = document.getElementById("title-name");
	// вътрешния див сиик
	seek = document.getElementById("inner-seek");
	img = document.getElementById("img");
	playbtn = document.getElementById("playpausebtn");
	wrapper = document.getElementById("wrapper");
	next = document.getElementById("next");
	prev = document.getElementById("prev");


	// външен див сиик
	seekOut = document.getElementById("seek");

	// event listeners

	playbtn.addEventListener('click',playPause,false);
	seekOut.addEventListener('click',function(event){ changeTime(event);});
	next.addEventListener('click', nextSong , false);
	prev.addEventListener('click', prevSong , false);
	list.addEventListener('click',function(event){ changeSongSideBtns(event);});


}
/**
 * създавам аудио обекта и му задавам начални стойности
 */
function createAudioObject() {
	audio = new Audio();

	dir = "assets/media/"

   audio.src = dir+playlist[0].path;
	// след като свърши песента да не почва отначало
	audio.loop = false;
	titleName.innerHTML = playlist[0].artist + "- " + playlist[0].song;

	// нулирам сиик дива
	seek.style.width = 0;

	img.src = dir+playlist[0].image;

	// променлива която ще показва индекса на песента която е на фокус
	id= 0;

}


/**
 * сменя песента при натискане на next бутона като гледа ако е последната песен
 да пусне пак първата
 */
function nextSong(){
	var nextSongPos = id;
	if(id == playlist.length-1){
		nextSongPos = -1;
	}

	changeSong(++nextSongPos);
}
/**
 * правя евент клик на ul( вече го имам като променлива ака list) в който гледам
 ако таргета ми е иконката за спиране и пускане проверявам дали тя свири в момента или е на
 фокус и ако е и викам само playPause метода ако не е на фокус то сменям песента
 като подавам идто на таргета на метода changeSong();
 */
function changeSongSideBtns(event){
	var _target = event.target;
	if(_target.className.indexOf("icon") == 0){
		if(_target.id != id){
			changeSong(_target.id);
		}else{
			playPause();
		}
	}
}
/**
 * обратното на nextSong
 */
function prevSong(){
	var prevSongPos = id;
	if(id == 0){
		prevSongPos = playlist.length;
	}

	changeSong(--prevSongPos);
}
/**
 * метод който сменя песента по даден индекс като заменя всичките атрибути ( картинка,
заглавието , оправя бутоните като сменя бутона на последната която свири да е плей и
нулира прогрес бара) и накрая пуска песента да свири
 */
function changeSong(index){

	document.getElementById(id).className = "icon fa fa-play";

	id = index;

	document.getElementById(id).className = "icon fa fa-pause";
	playbtn.className = "fa fa-pause";

	audio.src = dir+playlist[id].path;

	titleName.innerHTML = playlist[id].artist + "- " + playlist[id].song;

	seek.style.width = 0;

	img.src = dir+playlist[id].image;

	audio.play();
}
/**
 * event.clientX - seekOut.offsetLeft дава width на който е цъкнато след което
 пресмятаме реалната стойност за песента и слагаме currenttime да ни е равна на нея
 другата функция ще си сметне и оправи прогрес бара защото смяната на времето ще
 тригерне евента и ще се извика seektimeupdate function
 */
function changeTime(event) {

	var clickedPercent = (event.clientX - seekOut.offsetLeft) *( 100 / 960);
	var seekto = (clickedPercent/100) * audio.duration;
	audio.currentTime = seekto;


}
/**
 * функция която се тригерва от промяната във времето на песента

   audio.currentTime * (100 / audio.duration)  дава процента от песента на която сме в момента
	след това намирам стойноста на широчината по дадените проценти
 */
function seektimeupdate(){
		var nt = ((audio.currentTime * (100 / audio.duration))/ 100)*960;

		seek.style.width = nt+"px";

		var curmins = Math.floor(audio.currentTime / 60);
	    var cursecs = Math.floor(audio.currentTime - curmins * 60);
	    var durmins = Math.floor(audio.duration / 60);
	    var dursecs = Math.floor(audio.duration - durmins * 60);
		if(cursecs < 10){ cursecs = "0"+cursecs; }
	    if(dursecs < 10){ dursecs = "0"+dursecs; }
	    if(curmins < 10){ curmins = "0"+curmins; }
	    if(durmins < 10){ durmins = "0"+durmins; }
		curtimetext.innerHTML = curmins+":"+cursecs;
	    durtimetext.innerHTML = durmins+":"+dursecs;
}


/**
 * метод за спиране и пускане като сменя иконката на фокус песента
 */
function playPause(){

	if(audio.paused){
         audio.play();
			playbtn.className = "fa fa-pause";

			document.getElementById(id+"").className = "icon fa fa-pause";
      } else {
         audio.pause();
         playbtn.className = "fa fa-play";

			document.getElementById(id+"").className = "icon fa fa-play";
}

}
function createPlaylist() {

	// създавам вар за ul за да мога да го апендна после
	var list = document.getElementById("list");

	// фор от 0 до броя на песните(обектите) в масива playlist
	for(var i = 0; i < playlist.length ; i++){

		// ново li за всяка песен
		var li = document.createElement("li");


		// спан за номера на песента
		var number = document.createElement("span");

		// за номер ползваме поредния номер на песента в масива от сървара
		number.innerHTML = i +1;
		number.className = "number";

		// спан за името
		var title = document.createElement("span");

		// song artist са ключове в плейлист масива
		title.innerHTML = playlist[i].artist + "- " + playlist[i].song;
		title.className = "title";

		// спан за иконката
		var icon = document.createElement("span");

		icon.className = "icon fa fa-play";
		icon.id = i+"";


		// апендвам спановете към ли
		li.appendChild(number);
		li.appendChild(title);
		li.appendChild(icon);

		// апендвам готовия li към ul
		list.appendChild(li);

	}
}
