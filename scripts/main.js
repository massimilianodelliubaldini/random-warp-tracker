var imagePath = "./worlds/images/";
var jsonPath = "./worlds/json/";

var selectedWarp = "";
var warpDictionary = {};

function main() {

	$(".navItem").click( function(e) {
		e.preventDefault(); 
		loadWorld(e.target.id);
		return false; 
	});

	setupWorlds();
	setupWarps();
}

function setupWorlds() {

	$(".world").hover( function(e) {
		e.preventDefault(); 
		flashDetails();
		return false; 
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
	log("Loading world " + worldName + ".");

	fetch(jsonPath + worldName + ".json")
		.then(response => response.json())
		.then(data => {

			$("#currentWorldImage").attr("src", imagePath + data.imageName);
			$("#currentWorldMap").empty();
			for (var i = 0; i < data.warps.length; i++) {

				var warp = data.warps[i];
				var id = worldName + "." + warp.altName.toLowerCase().replace(" ", "");
				var hilight = getHilight(id);
				var area = "<area class='warp' shape='rect' coords='" + warp.coordString + "' id='" + id + "' alt='" + warp.altName + "'>";

				$("#currentWorldMap").append(area);
				$("#" + id).data("maphilight", hilight);
			}
			setupWarps();
		})
		.catch(error => console.log(error));
}

function getHilight(id) {
	var dest = warpDictionary[id];
	if(dest) {
		var source = warpDictionary[dest];
		if(source) {
			return {'strokeColor':'0080ff','strokeWidth':5,'fillColor':'0080ff','fillOpacity':0.6};
		}
		else {
			return {'strokeColor':'00ffff','strokeWidth':5,'fillColor':'00ffff','fillOpacity':0.6};
		}
	}
	else {
		return {'strokeColor':'ffffff','strokeWidth':5,'fillColor':'ffffff','fillOpacity':0.6};
	}	
}

function travelThru(source) {
	var dest = warpDictionary[source];
	if(dest) {
		log("Traveling thru " + source + ".");
		var destWorld = dest.split(".")[0];
		loadWorld(destWorld);
	}
	else {
		log(source + " is not linked to a destination.");
	}
}

function flashDetails(worldName) {
}

function startDoubleLink(firstLink) {
	log("Starting Double Link at " + firstLink + ".");
}

function finishDoubleLink(firstLink, secondLink) {
	log("Finishing Double Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = firstLink;
}

function startSingleLink(firstLink) {
	log("Starting Single Link at " + firstLink + ".");
}

function finishSingleLink(firstLink, secondLink) {
	log("Finishing Single Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
}

function log(s) {
	$("#hist")[0].value += s + "\n";
}