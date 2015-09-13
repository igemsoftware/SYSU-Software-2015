var plasmid;

function Plasmid() {
	this.plasmidCirs = [];
	var circuitCount = 0;
}

Plasmid.prototype.extendPartInfoByXml = function(xmlDoc) {
	part.name = $(xmlDoc).find('part_short_name').text();
	part.fullName = $(xmlDoc).find('part_short_desc').text();
	part.cds = $(xmlDoc).find('seq_data').text();
	part.length = part.cds.length;
}

Plasmid.prototype.getMarkerByPart = function(part) {
	var marker = {};
	marker.name = part.part_short_name;
	marker.BBa = part.BBa;
	marker.length = part.length;
	marker.cds = part.cds;
	marker.markerStyleIn = this.getMakerStyleIn(part);
	marker.markerStyleOut = this.getMarkerStyleOut(part);
	marker.vadjust = this.getVadjust(part);
	marker.valign = this.getValign(part);
	marker.showline = this.getShowline(part);
	return marker;
}

Plasmid.prototype.getMakerStyleIn = function(part) {
	if (part.type == 'promoter') {
		return "fill:rgba(170,0,85,0.9)";
	}
	if (part.type == 'RBS') {
		return "fill:rgba(237,184,78,0.9)";
	}
	if (part.type == 'gene') {
		return 'fill:rgba(155,131,193,0.9)';
	}
	if (part.type == 'terminal') {
		return "fill:rgba(255,221,238,0.6)";
	}
}

Plasmid.prototype.getMarkerStyleOut = function(part) {
	if (part.type == 'promoter') {
		return "fill:rgba(238,255,221,0.6)";
	}
	if (part.type == 'RBS') {
		return "fill:rgba(238,255,221,0.6)";
	}
	if (part.type == 'gene') {
		return 'fill:rgba(238,255,221,0.6)';
	}
	if (part.type == 'terminal') {
		return "fill:rgba(238,255,221,0.6)";
	}
}

Plasmid.prototype.getVadjust = function(part) {
	if (part.type == 'promoter') {
		return "65";
	}
	if (part.type == 'RBS') {
		return "50";
	}
	if (part.type == 'gene') {
		return '';
	}
	if (part.type == 'terminal') {
		return "55";
	}
}

Plasmid.prototype.getValign = function(part) {
	if (part.type == 'promoter') {
		return "outer";
	}
	if (part.type == 'RBS') {
		return "outer";
	}
	if (part.type == 'gene') {
		return '';
	}
	if (part.type == 'terminal') {
		return "outer";
	}
}

Plasmid.prototype.getShowline = function(part) {
	if (part.type == 'promoter') {
		return 1;
	}
	if (part.type == 'RBS') {
		return 1;
	}
	if (part.type == 'gene') {
		return 0;
	}
	if (part.type == 'terminal') {
		return 1;
	}
}

Plasmid.prototype.getMarkersLength = function(markers) {
	var length = 0;
	for (var i in markers) {
		length += markers[i].length;
	}
	return length;
}

Plasmid.prototype.formatCircuit = function(circuit, length, callback) {
	var that = this;
	var xmlDocs;
	var postDataJson = JSON.stringify(circuit);
	// $.post("/proxy", postDataJson, function(data) {
	// 		console.log('Circuit:')
	// 		console.log(data);
	// 		var circuit = data['circuit'];
	// 		var markers = [];
	// 		for (var i in circuit) {
	// 			markers.push(that.getMarkerByPart(circuit[i]));
	// 		}
	// 		console.log()
	// 		var plasmidCir = {};
	// 		circuitCount += 1;
	// 		plasmidCir.name = "circuit" + String(circuitCount);
	// 		plasmidCir.markers = markers;
	// 		plasmidCir.length = that.getMarkersLength();
	// 		that.plasmidCirs.push(plasmidCir);
			// if (that.circuitCount == length) {
			// 	callback();
			// }
		// }
	// );
}

Plasmid.prototype.loadCircuits = function(circuits, callback) {
	console.log("circuits:");
	console.log(circuits);
	// for (var i in circuits) {
	// 	this.formatCircuit(circuits[i], circuits.length, callback);
	// }
}


"use strict";
var app = angular.module('myApp', ['angularplasmid']);

app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
}]);

app.controller('PlasmidCtrl', ['$http', '$scope', '$timeout', function ($http, $scope, $timeout) {
    $http.get("/static/js/experiment/plasmidData.json")
  	.success(function(data) {
  		console.log(data);
  		$scope.plasmids = data;
  		$scope.currentPlasmid = $scope.plasmids[0];
  	});

  	// $http.get("/design/1")
  	// .success(function(data) {
  	// 	console.log("Design:");
  	// 	console.log(data['content']);
  	// 	var design = data['content'];
  	// 	plasmid = new Plasmid();
  	// 	plasmid.loadCircuits(design['plasmids'], function() {
  	// 		$scope.circuits = plasmid.plasmidCirs;
  	// 		console.log("Circuits:");
	  // 		console.log($scope.circuits);
  	// 	});
  	// });

	$scope.$watch('curPlaIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined) {
	  		$scope.currentPlasmid = $scope.plasmids[newValue];
		}
  	});

	$scope.$watch('curCirIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined) {
	  		$scope.currentCircuit = $scope.circuits[newValue];
		}
  	});

  	$scope.$watch('currentCircuit', function() {
  		if ($scope.currentCircuit !== undefined && $scope.currentPlasmid !== undefined) {
	  		var length = $scope.currentCircuit.length;
		  	var accumLength = $scope.currentPlasmid.length;
		  	for (var i in $scope.currentCircuit.markers) {
	  			$scope.currentCircuit.markers[i].start = accumLength;
	  			$scope.currentCircuit.markers[i].end = accumLength + $scope.currentCircuit.markers[i].length;
	  			accumLength += $scope.currentCircuit.markers[i].length;
	  		}
	  	}
  	})

  	$scope.$watch('currentPlasmid', function() {
  		if ($scope.currentCircuit !== undefined && $scope.currentPlasmid !== undefined) {
	  		var length = $scope.currentCircuit.length;
		  	var accumLength = $scope.currentPlasmid.length;
		  	for (var i in $scope.currentCircuit.markers) {
	  			$scope.currentCircuit.markers[i].start = accumLength;
	  			$scope.currentCircuit.markers[i].end = accumLength + $scope.currentCircuit.markers[i].length;
	  			accumLength += $scope.currentCircuit.markers[i].length;
	  		}
	  	}
  	})
}]);