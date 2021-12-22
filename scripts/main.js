var firstLink = "";
var warpDictionary = {};
var friendlyNames = {};

function main() {

	$(".navItem").click( function(e) {
		e.preventDefault(); 
		showWorld(e.target.id.replace("nav", "world"));
		$(".navItem").removeClass("selectedItem");
		$(this).addClass("selectedItem");
		return false; 
	});

	var loads = [];
	$(".world").each( function() {
		loads.push(loadWorld($(this)[0].id));
	});

	Promise.all(loads).then( function() {
		$(".warp").click( function(e) {
			e.preventDefault(); 
			travelThru(e.target.id);
			return false; 
		});

		$( function () {
			$.contextMenu({
				selector: ".warp",
				animation: {
					duration: 0, 
					show: 'slideDown', 
					hide: 'slideUp'
				},
				items: {
					startLink: {
						name: "Start Link",
						visible: function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							startLink($(this)[0].id); 
						}
					},
					cancelLink: {
						name: "Cancel Link",
						visible:  function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							cancelLink(); 
						}
					},
					finishTwoWay: {
						name: "Finish 2-Way Link",
						visible:  function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							finishDoubleLink($(this)[0].id);
						}
					},
					finishOneWay: {
						name: "Finish 1-Way Link",
						visible:  function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							finishSingleLink($(this)[0].id);
						}
					},
					deadEnd: {
						name: "Dead End",
						visible: function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							markDeadEnd($(this)[0].id); 
						}
					},
					keyLocation: {
						name: "Key Location",
						visible: function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							markKeyLocation($(this)[0].id); 
						}
					},
					unlink: {
						name: "Unlink",
						visible:  function(key, opt) {
							return showContextItems(key, $(this)[0].id);
						},
						callback: function(key, opt) { 
							unlink($(this)[0].id); 
						}
					}
				}
			});
		});

		$(".map").maphilight({alwaysOn:true});
	});
}

function loadWorld(worldId) {
	var worldName = worldId.replace("world", "");

	return fetch(jsonPath + worldName.toLowerCase() + ".json")
		.then(response => response.json())
		.then(data => {

			$("#world" + worldName + "Image").attr("src", imagePath + data.imageName);
			for (var i = 0; i < data.warps.length; i++) {

				var warp = data.warps[i];
				var warpId = worldId + splitter + warp.altName.toLowerCase().replaceAll(" ", "");
				var area = "<area class='warp unlinked' shape='rect' coords='" + warp.coordString + "' id='" + warpId + "' alt='" + warp.altName + "'>";

				$("#world" + worldName + "Map").append(area);
				$("#" + warpId).data("maphilight", hilightUnlinked);

				friendlyNames[warpId] = worldName + " " + warp.altName;
			}
		})
		.catch(error => console.log(error));
}

function showWorld(worldId) {
	$(".world").removeClass("selectedWorld");
	$("#" + worldId).addClass("selectedWorld");
	$("#worlds").prepend($("#" + worldId));
}

function showContextItems(itemKey, warpId) {
	var isWarpUnlinked = $("#" + warpId)[0].className.includes("unlinked");
	switch(itemKey) {
		case "startLink":
		case "deadEnd":
		case "keyLocation":
			return isWarpUnlinked;
		case "cancelLink":
			return firstLink != "";
		case "finishTwoWay":
		case "finishOneWay":
			return isWarpUnlinked && firstLink != "" && firstLink != warpId;
		case "unlink":
			return !isWarpUnlinked;
		default:
			return false;
	}
}

function travelThru(warpId) {
	var dest = warpDictionary[warpId];
	if(dest) {
		log("Traveling through " + friendlyNames[warpId] + " to " + friendlyNames[dest] + ".");
		var destWorldId = dest.split(splitter)[0];
		showWorld(destWorldId);
	}
	else {
		log(friendlyNames[warpId] + " is not linked to a destination.");
	}
}

function startLink(warpId) {
	log("Starting Link at " + friendlyNames[warpId] + ".");
	firstLink = warpId;
}

function cancelLink() {
	log("Cancelling Link.");
	firstLink = "";
}

function unlink(warpId) {

	var dest = warpDictionary[warpId];
	if(dest) {

		var source = warpDictionary[dest];
		if(source) {

			log("Uninking " + friendlyNames[dest] + ".");

			delete(warpDictionary[dest]);

			$("#" + dest).data("maphilight", hilightUnlinked);
			$("#" + dest).removeClass($("#" + dest)[0].className.replace("warp ", ""));
			$("#" + dest).addClass("unlinked");
		}		
		log("Uninking " + friendlyNames[warpId] + ".");

		delete(warpDictionary[warpId]);

		$("#" + warpId).data("maphilight", hilightUnlinked);
		$("#" + warpId).removeClass($("#" + warpId)[0].className.replace("warp ", ""));
		$("#" + warpId).addClass("unlinked");
	}

	$(".map").maphilight({alwaysOn:true});
}

function markDeadEnd(warpId) {
	log("Marking " + friendlyNames[warpId] + " a dead end.");

	warpDictionary[warpId] = deadEnd;

	$("#" + warpId).data("maphilight", hilightDeadEnd);
	$("#" + warpId).removeClass("unlinked");
	$("#" + warpId).addClass("deadEnd");

	$(".map").maphilight({alwaysOn:true});
}

function markKeyLocation(warpId) {
	log("Marking " + friendlyNames[warpId] + " a key location.");

	warpDictionary[warpId] = keyLocations[0];

	$("#" + warpId).data("maphilight", hilightKeyLocation);
	$("#" + warpId).removeClass("unlinked");
	$("#" + warpId).addClass("keyLocation");

	$(".map").maphilight({alwaysOn:true});
}

function finishDoubleLink(secondLink) {
	log("Finishing 2-Way Link from " + friendlyNames[firstLink] + " to " + friendlyNames[secondLink] + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = firstLink;

	$("#" + firstLink).data("maphilight", hilightTwoWay);
	$("#" + secondLink).data("maphilight", hilightTwoWay);

	$("#" + firstLink).removeClass("unlinked");
	$("#" + secondLink).removeClass("unlinked");

	$("#" + firstLink).addClass("twoWay");
	$("#" + secondLink).addClass("twoWay");

	firstLink = "";
	$(".map").maphilight({alwaysOn:true});
}

function finishSingleLink(secondLink) {
	log("Finishing 1-Way Link from " + friendlyNames[firstLink] + " to " + friendlyNames[secondLink] + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = deadEnd;

	$("#" + firstLink).data("maphilight", hilightOneWay);
	$("#" + secondLink).data("maphilight", hilightDeadEnd);

	$("#" + firstLink).removeClass("unlinked");
	$("#" + secondLink).removeClass("unlinked");

	$("#" + firstLink).addClass("oneWay");
	$("#" + secondLink).addClass("deadEnd");

	firstLink = "";
	$(".map").maphilight({alwaysOn:true});
}

function log(s) {
	if($("#hist")[0]) {
		$("#hist")[0].value += s + "\n";
		$('#hist').scrollTop($('#hist')[0].scrollHeight);
	}
	else {
		console.log(s);
	}
}