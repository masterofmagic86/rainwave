var Fave = function(json) {
	"use strict";
	var self = {};

	BOOTSTRAP.on_init.push(function(template) {
		API.add_callback("fave_song_result", song_fave_update);
		API.add_callback("fave_album_result", album_fave_update);
	});

	var change_fave = function(el_name, json) {
		if (!json.success) return;

		var faves = document.getElementsByName(el_name);
		var funcn = json.fave ? "add" : "remove";
		for (var i = 0; i < faves.length; i++) {
			faves[i].classList[funcn]("is_fave");
			if (faves[i].parentNode) faves[i].parentNode.classList[funcn]("fave_highlight");
		}
	};

	var song_fave_update = function(json) {
		change_fave("sfave_" + json.id, json);
	};

	var album_fave_update = function(json) {
		change_fave("afave_" + json.id, json);
	};

	var do_fave = function() {
		if (!this._fave_id) return;
		var set_to = !this.classList.contains("is_fave");
		if (this.getAttribute("name").substring(0, 5) == "sfave") {
			API.async_get("fave_song", { "fave": set_to, "song_id": this._fave_id });
		}
		else {
			API.async_get("fave_album", { "fave": set_to, "album_id": this._fave_id });
		}
	};

	self.register = function(json, is_album) {
		if (json.fave) {
			json.$t.fave.classList.add("is_fave");
			if (json.$t.fave.parentNode) json.$t.fave.parentNode.classList.add("fave_highlight");
		}
		json.$t.fave.setAttribute("name", is_album ? "afave_" + json.id : "sfave_" + json.id);
		json.$t.fave._fave_id = json.id;
		json.$t.fave.addEventListener("click", do_fave);
	};

	return self;
}();