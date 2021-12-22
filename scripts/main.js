var selectedWarp = "";
var warpDictionary = {};

function main() {

	$(".navItem").click( function(e) {
		e.preventDefault(); 
		showWorld(e.target.id.replace("nav", "world"));
		$(".navItem").removeClass("selectedItem");
		$(this).addClass("selectedItem");
		return false; 
	});

	setupWorlds();
	setupWarps();

	$(".map").maphilight({alwaysOn:true});
}

function setupWorlds() {

	$(".world").each( function() {
		loadWorld($(this)[0].id.replace("world", ""));
	});
}

function setupWarps() {

	$(".warp").click( function(e) {
		e.preventDefault(); 
		travelThru(e.target.id);
		return false; 
	});

	$(".warp").dblclick( function(e) {
		e.preventDefault();
		if(selectedWarp == "") {
			startDoubleLink(e.target.id);
			selectedWarp = e.target.id;
		}
		else {
			finishDoubleLink(selectedWarp, e.target.id);
			selectedWarp = "";
		}
		return false; 
	});

	$(".warp").contextmenu( function(e) {
		e.preventDefault(); 
		if(selectedWarp == "") {
			startSingleLink(e.target.id);
			selectedWarp = e.target.id;
		}
		else {
			finishSingleLink(selectedWarp, e.target.id);
			selectedWarp = "";
		}
		return false; 
	});
}

function loadWorld(worldName) {
	log("Loading " + worldName + ".");

	fetch(jsonPath + worldName.toLowerCase() + ".json")
		.then(response => response.json())
		.then(data => {

			$("#world" + worldName + "Image").attr("src", imagePath + data.imageName);
			for (var i = 0; i < data.warps.length; i++) {

				var warp = data.warps[i];
				var id = worldName.toLowerCase() + splitter + warp.altName.toLowerCase().replaceAll(" ", "");
				var hilight = getHilight(id);
				var area = "<area class='warp' shape='rect' coords='" + warp.coordString + "' id='" + id + "' alt='" + warp.altName + "'>";

				$("#world" + worldName + "Map").append(area);
				$("#" + id).data("maphilight", hilight);
			}
		})
		.catch(error => console.log(error));
}

function showWorld(worldId) {

	$(".world").removeClass("selectedWorld");
	$("#" + worldId).addClass("selectedWorld");
	$("#worlds").prepend($("#" + worldId));
}

function getHilight(id) {
	var dest = warpDictionary[id];
	if(dest) {
		if (dest == "deadend") {
			return hilightDeadEnd;
		}
		else {
			var source = warpDictionary[dest];
			if(source) {
				return hilightTwoWay;
			}
			else {
				return hilightOneWay;
			}
		}
	}
	else {
		return hilightUnlinked;
	}	
}

function travelThru(source) {
	var dest = warpDictionary[source];
	if(dest) {
		log("Traveling thru " + source + ".");
		var destWorld = dest.split(splitter)[0];
		loadWorld(destWorld);
	}
	else {
		log(source + " is not linked to a destination.");
	}
}

function startDoubleLink(firstLink) {
	log("Starting Double Link at " + firstLink + ".");
}

function finishDoubleLink(firstLink, secondLink) {
	log("Finishing Double Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = firstLink;
	$(".map").maphilight({alwaysOn:true});
}

function startSingleLink(firstLink) {
	log("Starting Single Link at " + firstLink + ".");
}

function finishSingleLink(firstLink, secondLink) {
	log("Finishing Single Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	$(".map").maphilight({alwaysOn:true});
}

function log(s) {
	$("#hist")[0].value += s + "\n";
    $('#hist').scrollTop($('#hist')[0].scrollHeight);
}