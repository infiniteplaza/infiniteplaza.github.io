var quotes_raw = "";
var quotes = [];
var quotes_only = [];
var quotes_msg = [];

var favs = ["haha", "funny", "lol"];

var filter = false;

var interval = null;

Array.prototype.shuffle = function() {
		var array = this;
		var counter = array.length;
		while (counter > 0) {
			var index = Math.floor(Math.random() * counter);
			counter--;
			var temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
}

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("start").addEventListener('click', this.showpoodle.bind(this), false);
        document.getElementById("backtomenu").addEventListener('click', this.hidepoodle.bind(this), false);
        document.getElementById("what").addEventListener('click', this.showdef.bind(this), false);
        document.getElementById("closedef").addEventListener('click', this.hidedef.bind(this), false);
        document.getElementById("settings").addEventListener('click', this.showsettings.bind(this), false);
        document.getElementById("hidesettings").addEventListener('click', this.hidesettings.bind(this), false);
        document.getElementById("showfav").addEventListener('click', this.showfavs.bind(this), false);
        document.getElementById("hidefav").addEventListener('click', this.removefavs.bind(this), false);
        document.getElementById("togglefilter").addEventListener('click', this.togglefilter.bind(this), false);
        document.getElementById("showsteckbrief").addEventListener('click', this.showsteckbrief.bind(this), false);
        document.getElementById("hidesteckbrief").addEventListener('click', this.hidesteckbrief.bind(this), false);
        document.getElementById("delfavs").addEventListener('click', function() {favs = []; this.savequote()}.bind(this), false);
        document.getElementById("favquote").addEventListener('click', this.favquote.bind(this), false);
        document.getElementById("about").addEventListener('click', this.clickcontact.bind(this), false);
		
		/*interval = setInterval(function() {
			window.scrollTo(0,0);
		}, 1);*/
		
	},
	
	randquote: function() {
		/*var i = Math.floor(Math.random() * quotes.length);*/
		var ret = [];
		if (filter) {
			ret = quotes_only[0];
			quotes_only.shift();
			quotes_only[quotes_only.length] = ret;
		} else {
			ret = quotes[0];
			quotes.shift();
			quotes[quotes.length] = ret;
		}
		return [ret[0], ret[1], ret[3], ret[2]]
	},
	
	showpoodle: function() {
		document.getElementById("container").setAttribute("class", 'slidein');
		document.getElementById("startmenu").setAttribute("class", 'slideout');
		
		
		var b = this.randquote();
		document.getElementById("msg").innerHTML = b[0];
		document.getElementById("creator").innerHTML = b[1];
		if (b[2]) {
			document.getElementById("what").setAttribute("style", "display: auto");
			document.getElementById("def").innerHTML = b[3];
		} else {
			document.getElementById("what").setAttribute("style", "display: none");
		}
	},
	
	showfavmsg: function(i) {
		document.getElementById("container").setAttribute("class", 'slidein');
		document.getElementById("favdiv").setAttribute("class", 'slideout');
		

		var b = quotes[quotes_msg.indexOf(i)];
		
		document.getElementById("msg").innerHTML = i;
		document.getElementById("creator").innerHTML = b[1];
		if (b[3]) {
			
			document.getElementById("what").setAttribute("style", "display: auto");
			document.getElementById("def").innerHTML = b[2];
		} else {
			document.getElementById("what").setAttribute("style", "display: none");
		}
	},
	
	hidepoodle: function() {
		document.getElementById("container").setAttribute("class", 'slideout');
		document.getElementById("startmenu").setAttribute("class", 'slidein');
	},
	
	showsettings: function() {
		document.getElementById("settingsdiv").setAttribute("class", 'slidein');
		document.getElementById("startmenu").setAttribute("class", 'slideout');
	}, 
	
	togglefilter: function() {
		filter = !filter;
		var b = document.getElementById("togglefilter");
		b.innerHTML = "Zeige nur Zitate mit einer Interpretation"
		if (filter) {
			b.innerHTML += " (AN)";
		} else {
			b.innerHTML += " (AUS)";
		}
	},
	
	hidesettings: function() {
		document.getElementById("settingsdiv").setAttribute("class", 'slideout');
		document.getElementById("startmenu").setAttribute("class", 'slidein');
	}, 
	
	clickcontact: function() {
		window.open("https://play.google.com/store/apps/details?id=org.InfinitePlaza.lessing");
	},
	
	showdef: function() {
		document.getElementById("definition").setAttribute("style", "display: auto");
		document.getElementById("definition").setAttribute("style", "opacity: 1");
	},
	
	hidedef: function() {
		document.getElementById("definition").setAttribute("style","opacity: 0;");
		setTimeout(function() {document.getElementById("definition").setAttribute("style","display: none")}, 200);
	},
	
	showfavs: function() {
		this.addfavs();
		document.getElementById("favdiv").setAttribute("class", 'slidein');
		document.getElementById("startmenu").setAttribute("class", 'slideout');
	},
	
	addfavs: function() {
		var b = document.getElementById("favdivcontent");
		var txt = "";
		
		favs.forEach(function(i) {
			txt += '<button id="fav_'+favs.indexOf(i).toString()+'" val="'+favs.indexOf(i).toString()+'" class="favitem">'+i+'</button><button val="'+favs.indexOf(i).toString()+'" id="fav_rev_'+favs.indexOf(i).toString()+'" class="favremove">X</button>';
		});
		
		b.innerHTML = txt; 
		var sf =this.showfavmsg
		var sq = this.savequote;
		
		favs.forEach(function(i) {
			var index = favs.indexOf(i).toString();
			
			document.getElementById("fav_rev_" + index).addEventListener('click', function() {
				document.getElementById("favdivcontent").removeChild(document.getElementById("fav_" + index));
				document.getElementById("favdivcontent").removeChild(document.getElementById("fav_rev_" + index));
				favs.splice(parseInt(index), 1);
				sq();
			}, false);
			
			document.getElementById("fav_" + index).addEventListener('click', function() {
				sf(favs[parseInt(index)]);
			}, false);
		});
	},
	
	favquote: function() {
		var c = document.getElementById("msg").innerHTML;
		if (favs.indexOf(c) == -1) {
			favs[favs.length] = c;
			this.savequote();
		}
	},
	
	savequote: function() {
		window.localStorage.setArray("favs", favs);
	},
	
	removefavs: function() {
		document.getElementById("favdiv").setAttribute("class", 'slideout');
		document.getElementById("startmenu").setAttribute("class", 'slidein');
	},
	
	showsteckbrief: function() {
		document.getElementById("steckbrief").setAttribute("class", 'slidein');
		document.getElementById("startmenu").setAttribute("class", 'slideout');
	},
	
	hidesteckbrief: function() {
		document.getElementById("steckbrief").setAttribute("class", 'slideout');
		document.getElementById("startmenu").setAttribute("class", 'slidein');
	},
	
	getquotes: function() {
		var mkqt = this.makequotes;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				quotes = mkqt(xhttp.responseText);
				document.getElementById("splash").setAttribute("style","opacity: 0;");
				setTimeout(function() {document.getElementById("splash").setAttribute("style","display: none")}, 500);
			} else if (this.readyState == 4) {
				document.getElementById("failedtoload").innerHTML = "Keine Internetverbindung. Bitte starte die App erneut";
			}
		};
		xhttp.open("GET", "https://infiniteplaza.github.io/lessing/lessing.txt", true);
		xhttp.send();
	},
	
	makequotes: function(data) {
		spl = data.split("|");
		console.log(spl);
		out = []
		
		spl.forEach(function(i){
			console.log(i);
			b = i.split(";");
			if (b[2] == undefined) {
				b[2] = '';
			}
			out[out.length] = [b[0], b[1], b[2], !b[2].trim() == ""];
		});
		
		out = out.shuffle();
		
		var deleted =0;
		for (var i = 0; i < out.length; i++) {
			if (out[i-deleted] == undefined) {
				out.pop(i-deleted);
			}
		}
		
		
		out.forEach(function(i){
			if (i[3]) {
				quotes_only[quotes_only.length] = i;
			}
			quotes_msg[quotes_msg.length] = i[0];
		});
		
		
		return out;
	},
	
	

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        this.getquotes();
		try {
			favs = window.localStorage.getArray("favs");
			if (!typeof favs[0] == "string") {
				favs.shift();
			}
		} catch(ex) {
			favs = [];
		}
    }
};

app.initialize();
app.onDeviceReady();