var firstLink = "";
var warpDictionary = {};

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
							alert("Foo!"); 
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
	switch(itemKey) {
		case "startLink":
		case "deadEnd":
		case "keyLocation":
			return $("#" + warpId)[0].className.includes("unlinked");
		case "cancelLink":
			return firstLink != "";
		case "finishTwoWay":
		case "finishOneWay":
			return $("#" + warpId)[0].className.includes("unlinked") && firstLink != "";
		case "unlink":
			return !$("#" + warpId)[0].className.includes("unlinked");
		default:
			return false;
	}
}

function travelThru(warpId) {
	var dest = warpDictionary[warpId];
	if(dest) {
		log("Traveling through " + warpId + " to " + dest + ".");
		var destWorldId = dest.split(splitter)[0];
		showWorld(destWorldId);
	}
	else {
		log(warpId + " is not linked to a destination.");
	}
}

function startLink(warpId) {
	log("Starting Link at " + warpId + ".");
	firstLink = warpId;
}

function cancelLink() {
	log("Cancelling Link.");
	firstLink = "";
}

function markDeadEnd(warpId) {
	log("Marking " + warpId + " a dead end.");

	warpDictionary[warpId] = deadEnd;

	$("#" + warpId).data("maphilight", hilightDeadEnd);
	$("#" + warpId).removeClass("unlinked");
	$("#" + warpId).addClass("deadEnd");

	$(".map").maphilight({alwaysOn:true});
}

function markKeyLocation(warpId) {
	log("Marking " + warpId + " a key location.");

	warpDictionary[warpId] = keyLocations[0];

	$("#" + warpId).data("maphilight", hilightKeyLocation);
	$("#" + warpId).removeClass("unlinked");
	$("#" + warpId).addClass("keyLocation");

	$(".map").maphilight({alwaysOn:true});
}

function finishDoubleLink(secondLink) {
	log("Finishing 2-Way Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = firstLink;

	$("#" + firstLink).data("maphilight", hilightTwoWay);
	$("#" + secondLink).data("maphilight", hilightTwoWay);

	$("#" + firstLink).removeClass("unlinked");
	$("#" + secondLink).removeClass("unlinked");

	$("#" + firstLink).addClass("twoWay");
	$("#" + secondLink).addClass("twoWay");

	$(".map").maphilight({alwaysOn:true});
}

function finishSingleLink(secondLink) {
	log("Finishing 1-Way Link from " + firstLink + " to " + secondLink + ".");

	warpDictionary[firstLink] = secondLink;
	warpDictionary[secondLink] = deadEnd;

	$("#" + firstLink).data("maphilight", hilightOneWay);
	$("#" + secondLink).data("maphilight", hilightDeadEnd);

	$("#" + firstLink).removeClass("unlinked");
	$("#" + secondLink).removeClass("unlinked");

	$("#" + firstLink).addClass("oneWay");
	$("#" + secondLink).addClass("deadEnd");

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