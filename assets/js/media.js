document.addEventListener("DOMContentLoaded",player , false);

var playlist;

function player() {


	Ajax.request('POST', 'ajax.php', true, function(response) {

		playlist = JSON.parse(response);

		createPlaylist();

	}, {min: 0, max: 3});




}

function createPlaylist() {

	console.log("!2312");
	var list = document.getElementById("list");

	console.log(playlist);



	for(var i = 0; i < playlist.length ; i++){


		var li = document.createElement("li");



		var number = document.createElement("span");

		number.innerHTML = i +1;
		number.className = "number";

		var title = document.createElement("span");

		title.innerHTML = playlist[i].artist + "- " + playlist[i].song;
		title.className = "title";

		var icon = document.createElement("span");

		icon.className = "icon fa fa-play";

		li.appendChild(number);
		li.appendChild(title);
		li.appendChild(icon);

		list.appendChild(li);

		console.log(li);

	}
}
