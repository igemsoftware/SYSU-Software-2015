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
  	});

	$scope.$watch('currentIndex', function(newValue,oldValue, scope) {
		if (newValue !== undefined)
	  		$scope.currentPlasmid = $scope.plasmids[newValue];
  	});
}]);