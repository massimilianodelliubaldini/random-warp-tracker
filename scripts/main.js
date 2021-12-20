function main() {

	var selectedWarp = {};

	$('.navItem').click( function(e) {
		e.preventDefault(); 
		loadWorld(e.target.id);
		return false; 
	});

	$('.world').hover( function(e) {
		e.preventDefault(); 
		flashDetails();
		return false; 
	});

	$('.warp').click( function(e) {
		e.preventDefault(); 
		loadWorld(e.target.id);
		return false; 
	});

	$('.warp').dblclick( function(e) {
		e.preventDefault();
		if(selectedWarp === {}) {
			startDoubleLink(e);
			selectedWarp = e;
		}
		else {
			finishDoubleLink(selectedWarp, e);
			selectedWarp = {};
		}
		return false; 
	});

	$('.warp').contextmenu( function(e) {
		e.preventDefault(); 
		if(selectedWarp === {}) {
			startSingleLink(e);
			selectedWarp = e;
		}
		else {
			finishSingleLink(selectedWarp, e);
			selectedWarp = {};
		}
		return false; 
	});
}

function loadWorld(worldName) {
	console.log("Loading World " + worldName + ".");

	var worldPath = "./worlds/json/" + worldName + ".json";
	fetch(worldPath)
		.then(response => response.json())
		.then(data => {
			console.log(data);

			$("#currentWorldImage").attr("src", data.imagePath);
			$("#currentWorldMap").empty();
			for (var i = 0; i < data.warps.length; i++) {
				var warp = data.warps[i];
				var area = "<area shape='rect' coord='" + warp.coordString + "' alt='" + warp.altName + "' href='#' class='warp'>";
				$("#currentWorldMap").append(area);
			}
		})
		.catch(error => console.log(error));
}

function flashDetails(worldName) {
	console.log("Flashing details of " + worldName + ".");
}

function startDoubleLink(firstLink) {
	console.log("Starting Double Link at " + firstLink + ".");
}

function finishDoubleLink(firstLink, secondLink) {
	console.log("Finishing Double Link from " + firstLink + " to " + secondLink + ".");
}

function startSingleLink(firstLink) {
	console.log("Starting Single Link at " + firstLink + ".");
}

function finishSingleLink(firstLink, secondLink) {
	console.log("Finishing Single Link from " + firstLink + " to " + secondLink + ".");
}