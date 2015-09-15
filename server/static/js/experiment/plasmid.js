var plasmid;
var currentPart;

function Plasmid() {
	this.plasmidCirs = [];
	this.circuitCount = 0;
}

Plasmid.prototype.init = function() {
	this.addReadPartInfoEvent($("#readPartInfo"));
}

Plasmid.prototype.getMarkerByPart = function(part) {
	var marker = {};
	marker.name = part.name
	marker.part_short_name = part.part_short_name;
	marker.part_short_des = part.part_short_des;
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
	if (part.type == 'terminator') {
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
	if (part.type == 'terminator') {
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
		return '15';
	}
	if (part.type == 'terminator') {
		return "65";
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
		return 'outer';
	}
	if (part.type == 'terminator') {
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
		return 1;
	}
	if (part.type == 'terminator') {
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
	// console.log('Post Circuit:');
	// console.log(circuit);
	$.ajax({
		type: 'POST',
		url: '/proxy',
		data: postDataJson,
		dataType : 'json',
		contentType: 'application/json',
		success: function(data) {
			var circuit = data['circuit'];
			var markers = [];
			for (var i in circuit) {
				markers.push(that.getMarkerByPart(circuit[i]));
			}
			var plasmidCir = {};
			that.circuitCount += 1;
			plasmidCir.name = "Circuit" + String(that.circuitCount);
			plasmidCir.markers = markers;
			plasmidCir.length = that.getMarkersLength(markers);
			plasmidCir.parts = circuit;
			that.plasmidCirs.push(plasmidCir);
			if (that.circuitCount == length) {
				callback();
			}
		}
	});
}

Plasmid.prototype.loadCircuits = function(circuits, callback) {
	for (var i in circuits) {
		this.formatCircuit(circuits[i], circuits.length, callback);
	}
}

Plasmid.prototype.addReadPartInfoEvent = function(moreElem) {
    moreElem.click(function() {
        $("#readPartInfoModal").modal({transition: 'horizontal flip'}).modal('show');
    });
}

Plasmid.prototype.writePartInfoToModal = function(part) {
    var infoModal = $("#readPartInfoModal");
    infoModal.find('.partName').text(part.name);
    infoModal.find('.partBBa').text(part.BBa == '' ? 'None': part.BBa);
    infoModal.find('.partImg').attr('src', '/static/img/design/parts/'+part.type+'_70.png');
    infoModal.find('.partType').text(part.type);
    infoModal.find('.partRisk').text(Util.getRiskText(part.risk));
    infoModal.find('.partRisk').attr("class", "partRisk");
    infoModal.find('.partRisk').addClass(Util.getRiskColor(part.risk));
    infoModal.find('.partBact').text(part.bacterium);
    infoModal.find('.partIntro').text(part.introduction);
    infoModal.find('.partSource').text(part.source);

    var that = this;
    this.ncbiUrl = "http://www.ncbi.nlm.nih.gov/gquery/?term=" + part.name;
    this.fastaUrl = "http://parts.igem.org/fasta/parts/" + part.BBa;
    this.part = part;
    $("#ncbiBtn").click(function() {
        window.open(that.ncbiUrl);
    });
    $("#fastaBtn").click(function() {
        window.open(that.fastaUrl);
    });
    $("#searchCds").click(function() {
        var there = this;
        $(this).addClass('loading');
        var postDataJson = JSON.stringify({BBa: that.part.BBa});
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/proxy/part/cds',
            dataType : 'json',
            data : postDataJson,
            success: function(data) {
                $("#cdsModal").find('.cdsContent').text(data['cds']);
                $("#cdsModal").modal('show');
                $(there).removeClass('loading');
                $("#cdsModal").find('.back').click(function() {
                    $("#cdsModal").modal('hide');
                    $("#readPartInfoModal").modal('show');
                });
            }
        });
    });
}

Plasmid.prototype.addDevicePartInfoEvent = function(moreElem) {
    var that = this;
    moreElem.click(function() {
        var deviceName = $(this).parent().find('.item').attr('device-name');
        var device = DataManager.getDeviceByName(deviceName);
        that.writeDeviceInfoToModal(device);
        $("#readDeviceInfoModal").modal('show');
    });
}

Plasmid.prototype.writeDeviceInfoToModal = function(device) {
    var infoModal = $("#readDeviceInfoModal");
    infoModal.find('.deviceName').text(device.name);
    infoModal.find('.deviceParts').text(Util.getDevicePartsString(device));
    infoModal.find('.deviceImg').attr('src', '/static/img/design/devices/'+device.name+'.png');
    infoModal.find('.deviceRisk').text(Util.getRiskText(device.risk));
    infoModal.find('.deviceRisk').attr("class", "deviceRisk");
    infoModal.find('.deviceRisk').addClass(Util.getRiskColor(device.risk));
    infoModal.find('.deviceInterface').text(device.interfaceA+", "+device.interfaceB);
    infoModal.find('.deviceSource').text(device.source);
    infoModal.find('.deviceIntro').text(device.full_description);
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
  		$scope.plasmids = data;
  		// $scope.currentPlasmid = $scope.plasmids[0];
  	});

  	$http.get("/design/data/1")
  	.success(function(data) {
  		console.log("Design:");
  		console.log(data['content']);
  		var design = data['content'];
  		$scope.circuits = null;
  		if (design['plasmids'].length == 0) {
  			console.log('Plasmids is empty!!');
  			$('#loadingData').dimmer('hide');
  			$("#errorModal").modal({transition: 'bounce'}).modal('show');
  			return;
  		}
  		plasmid.loadCircuits(design['plasmids'], function(scope) {
  			$scope.circuits = plasmid.plasmidCirs;
  			console.log("Circuits:");
	  		console.log($scope.circuits);
	  		$('#loadingData').dimmer('hide');
  		});
  	});

	$scope.$watch('curPlaIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined) {
	  		$scope.currentPlasmid = $scope.plasmids[newValue];
		}
  	});

	$scope.$watch('curCirIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined) {
	  		$scope.currentCircuit = $scope.circuits[newValue];
	  		$scope.parts = $scope.circuits[newValue].parts;
		}
  	});

  	$scope.$watch('curPartsIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined) {
	  		$scope.currentPart = $scope.parts[newValue];
	  		plasmid.writePartInfoToModal($scope.currentPart);
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


$(function() {
	plasmid = new Plasmid();
	plasmid.init();
});
