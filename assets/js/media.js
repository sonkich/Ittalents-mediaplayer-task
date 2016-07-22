document.addEventListener("DOMContentLoaded",player , false);
// var init
var playlist;

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

	});




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


		// апендвам спановете към ли
		li.appendChild(number);
		li.appendChild(title);
		li.appendChild(icon);

		// апендвам готовия li към ul
		list.appendChild(li);

	}
}
