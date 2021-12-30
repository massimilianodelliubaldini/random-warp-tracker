var firstLink = "";
var warpDictionary = {};
var lockDictionary = {};
var friendlyNames = {};

function main() {

	friendlyNames = {...locks};

	// Start by loading worlds.json, which tells us the number and names of worlds we have to load.
	var loads = [];
	loadWorlds()
		.then( function() {

			// For each world we identified, load that world by name. Store the promise of each load in an array.
			$(".world").each( function() {
				loads.push(loadWorld($(this)[0].id));
			});
		})
		.then( function() {

			// Once all of the promises have been fulfilled, we can set up our click events and context menu.
			// We only want to do this part once, otherwise click events will stack up multiple times per click.
			Promise.all(loads).then( function() {

				// Set up the left click on navigation items to make the selected world visible.
				$(".navItem").click( function(e) {
					e.preventDefault(); 
					showWorld(e.target.id.replace("nav", ""));
					return false; 
				});

				// Set up the left click on warp points to travel through them, if they are linked.
				$(".warp").click( function(e) {
					e.preventDefault(); 
					travelThru(e.target.id);
					return false; 
				});

				// Set up the hover on linked/key warp points to see where they lead without having to click on them.
				// This is a read-only context menu that just shows you information, you cannot actually interact with it.
				$( function () {
					$.contextMenu({
						selector: ".warp.twoWay, .warp.oneWay, .warp.keyLocation", 
						trigger: "hover",
						delay: 500,
						build: function($triggerElement, e) {
							var hoverDest = friendlyNames[warpDictionary[$triggerElement[0].id]];
							var hoverLock = friendlyNames[lockDictionary[$triggerElement[0].id]];
        					return {
								animation: {
									duration: 0, 
									show: "slideDown", 
									hide: "slideUp"
								},
								position: function(opt, x, y){
									opt.$menu.css({top: y + 10, left: x + 10});
								},
								autoHide: true,
								items: {
									hoverItemA: {
										name: hoverDest,
										disabled: true
									},
									hoverItemB: {
										name: "Requires " + hoverLock,
										disabled: true,
										visible: hoverLock ? true : false
									}
								}
							};
						}
					});
				});

				// Set up the main context menu with all the options.
				// Visibility of each option is dependent on the selected warp.
				// This takes up a lot of space, so I want to make this a separate script, 
				// but IDK if that would affect the scope of $(this)...
				$( function () {
					$.contextMenu({
						selector: ".warp",
						animation: {
							duration: 0, 
							show: "slideDown", 
							hide: "slideUp"
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
							locks: {
								name: "Locks",
								visible: function(key, opt) {
									return showContextItems(key, $(this)[0].id);
								},
								items: {
									hm01: {
										name: "Cut",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm02: {
										name: "Fly",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm03: {
										name: "Surf",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm04: {
										name: "Strength",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm05: {
										name: "Flash",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm06: {
										name: "Rock Smash",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									hm07: {
										name: "Waterfall",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									mach: {
										name: "Mach Bike",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									acro: {
										name: "Acro Bike",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
									story: {
										name: "Story Progression",
										callback: function(key, opt) {
											markLockedLocation(key, $(this)[0].id);
										}
									},
								}
							},
							keyLocation: {
								name: "Key Location",
								visible: function(key, opt) {
									return showContextItems(key, $(this)[0].id);
								},
								items: {
									gym1: {
										name: "Gym 1",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym2: {
										name: "Gym 2",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym3: {
										name: "Gym 3",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym4: {
										name: "Gym 4",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym5: {
										name: "Gym 5",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym6: {
										name: "Gym 6",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym7: {
										name: "Gym 7",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									gym8: {
										name: "Gym 8",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite1frontdoor: {
										name: "Elite 1 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite1backdoor: {
										name: "Elite 1 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite2frontdoor: {
										name: "Elite 2 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite2backdoor: {
										name: "Elite 2 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite3frontdoor: {
										name: "Elite 3 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite3backdoor: {
										name: "Elite 3 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite4frontdoor: {
										name: "Elite 4 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite4backdoor: {
										name: "Elite 4 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									champion: {
										name: "Champion",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
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

				// Finally, enable map hilighting after all the warps have been loaded.
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
				var worldId = "world" + world.worldName; // A little bit of notation to differentiate world objects from navigation objects.

				var nav = "<li class='navItem'><a href='javascript:void(0);' id='nav" + world.worldName + "'>" + world.navName + "</a></li>";
				switch(world.navType) {
					case "key":
						$("#keys").append(nav);
						break;
					case "city":
						$("#cities").append(nav);
						break;
					default:
						$("#others").append(nav);
						break;
				}

				var div = "<div id='" + worldId + "' class='world'></div>";
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

	// Bad practice: I really should not rely on the name of the world to find the correct JSON file.
	var worldName = worldId.replace("world", "");

	return fetch(jsonPath + worldName.toLowerCase() + ".json") 
		.then(response => response.json())
		.then(data => {

			$("#" + worldId + "Image").attr("src", imagePath + data.imageName);
			for (var i = 0; i < data.warps.length; i++) {

				// Bad practice: I really really should not rely on the name of the warp to give it an ID.
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

function showWorld(navWorldId) {

	// I think it is much faster to load all the worlds ahead of time, 
	// and just toggle visibility and position when you want to go to one.
	if(navWorldId) {
		$(".world").removeClass("selectedWorld");
		$("#world" + navWorldId).addClass("selectedWorld");
		$("#worlds").prepend($("#world" + navWorldId));

		$(".navItem").removeClass("selectedItem");
		$("#nav" + navWorldId).parent().addClass("selectedItem");
	}
}

function showContextItems(itemKey, warpId) {

	// Booleans used multiple times below.
	var isWarpUnlinked = $("#" + warpId)[0].className.includes("unlinked");
	var hasStartedLink = firstLink != "";

	// Allow fall-through so multiple items use the same visibility logic.
	switch(itemKey) {
		case "startLink":
		case "deadEnd":
		case "keyLocation":
			return isWarpUnlinked;
		case "cancelLink":
			return hasStartedLink;
		case "finishTwoWay":
		case "finishOneWay":
			return isWarpUnlinked && hasStartedLink && firstLink != warpId;
		case "unlink":
		case "locks":
			return !isWarpUnlinked;
		default:
			return false;
	}
}
function showContextIcons(itemKey) {
	return Object.values(warpDictionary).includes("worldKeyLocations" + splitter + itemKey) ? "context-menu-icon-checked" : "";
}

function travelThru(warpId) {
	var dest = warpDictionary[warpId];
	if(dest) {
		if(dest == deadEnd) {
			log(friendlyNames[warpId] + " is a dead end.");
		}
		else
		{
			log("Traveling through " + friendlyNames[warpId] + " to " + friendlyNames[dest] + ".");
			var destWorldId = dest.split(splitter)[0];
			showWorld(destWorldId.replace("world", ""));
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

function markLockedLocation(lock, warpId) {
	log("Locking " + friendlyNames[warpId] + " behind " + friendlyNames[lock] + ".");

	lockDictionary[warpId] = lock;
}

function markKeyLocation(key, warpId) {
	var keyWarpId = "worldKeyLocations" + splitter + key;
	log("Marking " + friendlyNames[warpId] + " as " + friendlyNames[keyWarpId] + ".");

	warpDictionary[warpId] = keyWarpId;
	warpDictionary[keyWarpId] = warpId;

	$("#" + warpId).data("maphilight", hilightKeyLocation);
	$("#" + keyWarpId).data("maphilight", hilightKeyLocation);

	$("#" + warpId).removeClass("unlinked");
	$("#" + keyWarpId).removeClass("unlinked");
	
	// Use twoWay class so that you can still travel through key locations and back if need be.
	$("#" + warpId).addClass("twoWay");
	$("#" + keyWarpId).addClass("twoWay");

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

	// Kludge: I mark the other side of a 1-way warp a deadEnd.
	// This is how I prevent you from going back through it the wrong way.
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