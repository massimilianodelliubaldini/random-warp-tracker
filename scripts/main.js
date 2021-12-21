var imagePath = "./worlds/images/";
var jsonPath = "./worlds/json/";

var selectedWarp = "";
var warpDictionary = {};

function main() {

	$('.navItem').click( function(e) {
		e.preventDefault(); 
		loadWorld(e.target.id);
		return false; 
	});

	setupWorlds();
	setupWarps();
}

function setupWorlds() {

	$('.world').hover( function(e) {
		e.preventDefault(); 
		flashDetails();
		return false; 
	});
}

function setupWarps() {

	$('.warp').click( function(e) {
		e.preventDefault(); 
		travelThru(e.target.id);
		return false; 
	});

	$('.warp').dblclick( function(e) {
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

	$('.warp').contextmenu( function(e) {
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
	console.log("Loading world " + worldName + ".");

	fetch(jsonPath + worldName + ".json")
		.then(response => response.json())
		.then(data => {
			console.log(data);

			$("#currentWorldImage").attr("src", imagePath + data.imageName);
			$("#currentWorldMap").empty();
			for (var i = 0; i < data.warps.length; i++) {

				var warp = data.warps[i];
				var id = worldName + "." + warp.altName.toLowerCase().replace(" ", "");
				var area = "<area class='warp' shape='rect' coords='" + warp.coordString + "' id='" + id + "' alt='" + warp.altName + "'>";

				$("#currentWorldMap").append(area);
			}
			setupWarps();
		})
		.catch(error => console.log(error));
}

function travelThru(source) {
	console.log("Traveling thru " + source + ".");

	if(source.includes("."))
	{
		var dest = warpDictionary[source];
		if(dest)
		{
			var destWorld = dest.split(".")[0];
			loadWorld(destWorld);
		}
		else
		{
			console.log("Travel cancelled, " + source + " is not linked to a destination.");
		}
	}
	else
	{
		console.log("Travel cancelled, " + source + " is not a warp ID (worldName.warpName).");
	}
}

function flashDetails(worldName) {
	console.log("Flashing details of " + worldName + ".");
}

function startDoubleLink(firstLink) {
	console.log("Starting Double Link at " + firstLink + ".");
}

function finishDoubleLink(firstLink, secondLink) {
	console.log("Finishing Double Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = firstLink;
}

function startSingleLink(firstLink) {
	console.log("Starting Single Link at " + firstLink + ".");
}

function finishSingleLink(firstLink, secondLink) {
	console.log("Finishing Single Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
}