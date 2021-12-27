var firstLink = "";
var warpDictionary = {};
var friendlyNames = {};

function main() {

	friendlyNames = {...keyLocations};

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
					var travelled = showWorld(e.target.id.replace("nav", "world"));
					if(travelled) {
						$(".navItem").removeClass("selectedItem");
						$(this).addClass("selectedItem");
					}
					return false; 
				});

				$(".warp").click( function(e) {
					e.preventDefault(); 
					travelThru(e.target.id);
					return false; 
				});

				$( function () {
					$.contextMenu({
						selector: ".warp.twoWay, .warp.oneWay, .warp.keyLocation", 
						trigger: "hover",
						delay: 500,
						build: function($triggerElement, e) {
							var hoverDest = friendlyNames[warpDictionary[$triggerElement[0].id]];
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
									hoverLink: {
										name: hoverDest,
										disabled: true
									}
								}
							};
						}
					});
				});

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
									elite41backdoor: {
										name: "Elite4 1 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite42backdoor: {
										name: "Elite4 2 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite43backdoor: {
										name: "Elite4 3 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite44backdoor: {
										name: "Elite4 4 Back Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite41frontdoor: {
										name: "Elite4 1 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite42frontdoor: {
										name: "Elite4 2 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite43frontdoor: {
										name: "Elite4 3 Front Door",
										icon: function (opt, $itemElement, itemKey, item) {
											return showContextIcons(itemKey);
										},
										callback: function(key, opt) { 
											markKeyLocation(key, $(this)[0].id); 
										}
									},
									elite44frontdoor: {
										name: "Elite4 4 Front Door",
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

				var nav = "<li class='navItem'><a href='javascript:void(0);'><span id='nav" + world.worldName + "'>" + world.navName + "</span></a></li>";
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
		return true;
	}
	return false;
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
function showContextIcons(itemKey) {
	return Object.values(warpDictionary).includes(itemKey) ? "context-menu-icon-checked" : "";
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
	log("Marking " + friendlyNames[warpId] + " as " + friendlyNames[key] + ".");

	var keyWarpId = "worldKeyLocations" + splitter + key;
	warpDictionary[warpId] = keyWarpId;
	warpDictionary[keyWarpId] = warpId;

	$("#" + warpId).data("maphilight", hilightKeyLocation);
	$("#" + keyWarpId).data("maphilight", hilightKeyLocation);

	$("#" + warpId).removeClass("unlinked");
	$("#" + keyWarpId).removeClass("unlinked");
	
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