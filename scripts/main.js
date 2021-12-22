var firstLink = "";
var warpDictionary = {};
var friendlyNames = {};

function main() {

	var loads = [];
	loadWorlds()
		.then( function() {
			$(".world").each( function() {
				loads.push(loadWorld($(this)[0].id));
			});
		})
		.then( function() {
			Promise.all(loads).then( function() {

				$(".navItem").click( function(e) {
					e.preventDefault(); 
					showWorld(e.target.id.replace("nav", "world"));
					$(".navItem").removeClass("selectedItem");
					$(this).addClass("selectedItem");
					return false; 
				});

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
								items: {
									gym_1: {
										name: "Gym 1",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_2: {
										name: "Gym 2",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_3: {
										name: "Gym 3",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_4: {
										name: "Gym 4",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_5: {
										name: "Gym 5",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_6: {
										name: "Gym 6",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_7: {
										name: "Gym 7",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym_8: {
										name: "Gym 8",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									e4_1: {
										name: "Elite4 1",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									e4_2: {
										name: "Elite4 2",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									e4_3: {
										name: "Elite4 3",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									e4_4: {
										name: "Elite4 4",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									champion: {
										name: "Champion",
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
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
		});
}

function loadWorlds() {
	return fetch(jsonPath + "worlds.json")
		.then(response => response.json())
		.then(data => {

			for (var i = 0; i < data.worlds.length; i++) {

				var world = data.worlds[i];
				var worldId = "world" + world.worldName;

				var nav = "<a class='navItem' href='javascript:void(0);'><span id='nav" + world.worldName + "'>" + world.navName + "</span></a>";
				switch(world.navType) {
					case "key":
						$("#keys").after(nav);
						break;
					case "city":
						$("#cities").after(nav);
						break;
					default:
						$("#others").after(nav);
						break;
				}

				var div = "<div id='" + worldId + "' class='hdiv world'></div>";
				$("#worlds").append(div);
				
				var img = "<img id='" + worldId + "Image' src='' usemap='#map" + world.worldName + "' class='map'/>";
				$("#" + worldId).append(img);

				var map = "<map id='" + worldId + "Map' name='map" + world.worldName + "'></map>";
				$("#" + worldId).append(map);
			}
		})
		.catch(error => console.log(error));
}

function loadWorld(worldId) {
	var worldName = worldId.replace("world", "");

	return fetch(jsonPath + worldName.toLowerCase() + ".json")
		.then(response => response.json())
		.then(data => {

			$("#" + worldId + "Image").attr("src", imagePath + data.imageName);
			for (var i = 0; i < data.warps.length; i++) {

				var warp = data.warps[i];
				var warpId = worldId + splitter + warp.altName.toLowerCase().replaceAll(" ", "");

				var area = "<area class='warp unlinked' shape='rect' coords='" + warp.coordString + "' id='" + warpId + "' alt='" + warp.altName + "'>";
				$("#" + worldId + "Map").append(area);
				$("#" + warpId).data("maphilight", hilightUnlinked);

				friendlyNames[warpId] = worldName + " " + warp.altName;
			}
		})
		.catch(error => console.log(error));
}

function showWorld(worldId) {
	if(worldId) {
		$(".world").removeClass("selectedWorld");
		$("#" + worldId).addClass("selectedWorld");
		$("#worlds").prepend($("#" + worldId));
	}
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
		if(dest == deadEnd) {
			log(friendlyNames[warpId] + " is a dead end.");
		}
		else if(Object.keys(keyLocations).includes(dest)) {
			log(friendlyNames[warpId] + " is a key location.");
		}
		else
		{
			log("Traveling through " + friendlyNames[warpId] + " to " + friendlyNames[dest] + ".");
			var destWorldId = dest.split(splitter)[0];
			showWorld(destWorldId);
		}
	}
	else {
		log(friendlyNames[warpId] + " is unlinked.");
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

function markKeyLocation(key, warpId) {
	log("Marking " + friendlyNames[warpId] + " as " + keyLocations[key] + ".");

	warpDictionary[warpId] = key;

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