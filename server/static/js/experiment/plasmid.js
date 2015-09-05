"use strict";

var plasmid; 

function Plasmid() {
	this.plasmidBones = [];
}

Plasmid.prototype.init = function() {
	this.loadPlasmidData();
}

Plasmid.prototype.drawPlasmidBone = function(circuit, plasmidBone) {

}

Plasmid.prototype.loadPlasmidData = function() {
	var that = this;
    $.get("/static/js/experiment/plasmidData.json", function(data, status) {
    	console.log(JSON.parse(data));
        that.plasmidBones = JSON.parse(data);
    });
}

$('.ui.dropdown').dropdown();

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
  		// $scope.currentPlasmid = $scope.plasmids[0];
  	});

  	$http.get("/static/js/experiment/circuit1.json")
  	.success(function(data) {
  		console.log(data);
  		$scope.circuits = data;
  	});

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