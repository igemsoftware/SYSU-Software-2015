/**
 * @file design.js
 * @description Help the user to design circuits and logics
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @data Aug 30 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict";

var leftbar;

function LeftBar() {
    this.isOpenLeftBar = false;
    this._leftBarWidth = 350;
    this.view = $("#left-sidebar");
    this.view.protocols = $("#left-sidebar-body");
    this.leftTrigger = $(".trigger-left");
    this.view.searchPro = $("#searchPro");
    this._searchTitle = [];

    this.protocolElemsList = [];
    this.protocolsMap = [];
    this.protocolCount = 0;
};

LeftBar.prototype.init = function() {
	this._leftTriggerAnimation();
	this.enableSearchBox();
};

LeftBar.prototype._leftTriggerAnimation = function() {
    var that = this;
    this.leftTrigger.click(function() {
        var left = that.view.css("left");
        if (parseInt(left) == 0) {
            that.isOpenLeftBar = false;
            that.view.animate({
                left: '-' + that._leftBarWidth + 'px'
            }, 500);

            $("#add-protocol").css("color", "#EDEDEF");
            that.leftTrigger.find("i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;

            that.view.animate({
                left: '0px'
            }, 500);
            
            $("#add-protocol").css("color", "#72d3e3");
            that.leftTrigger.find("i").removeClass("right").addClass("left");
        }
    });
};

LeftBar.prototype.createProtocolView = function(protocol, id) {
	var divElem = $("<div></div>");
	var starIconElem = $("<i></i>");
	var zoomIconElem =  $("<i></i>");
	var titleSpanElem = $("<span></span>");
	var likesSpanElem = $("<span></span>");

	divElem.addClass("item");

	starIconElem.addClass("empty star icon");
	// starIconElem.text(protocol.likes);
	likesSpanElem.addClass("likes");
	likesSpanElem.text(protocol.likes);
	zoomIconElem.addClass("zoom icon more");
	titleSpanElem.text(protocol.name);
	titleSpanElem.addClass("protocolTitle");

	divElem.append(titleSpanElem);
	divElem.append(zoomIconElem);
	divElem.append(starIconElem);
	divElem.append(likesSpanElem);
	divElem.attr("id", id);
	this._searchTitle.push({title: protocol.name});
	this.protocolElemsList.push(divElem);

	return divElem;
};

LeftBar.prototype.addProtocolView = function(protocolElem) {
	protocolElem.appendTo($("#left-sidebar-body"));
};

LeftBar.prototype.initProtocolElems = function(protocols) {
	for (var i in protocols) {
		var protocolElem = this.createProtocolView(protocols[i], i);
		this.addProtocolView(protocolElem);
	}
}

LeftBar.prototype.showView = function(protocolELems) {
	this.view.protocols.empty();
	for (var i in protocolELems) {
		this.addProtocolView(protocolELems[i], i);
	}
};

LeftBar.prototype.enableSearchBox = function() {
    var that = this;
    this.view.searchPro.keyup(function() {
    	var val = that.view.searchPro.val().toLowerCase();
        if (val != "") {
        	var searchElemPartList = [];
        	for (var i in that.protocolElemsList) {
        		var title = $(that.protocolElemsList[i].find(".protocolTitle")[0]).text().toLowerCase();
        		console.log(title);
        		if (title.indexOf(val) != -1) {
        			searchElemPartList.push(that.protocolElemsList[i]);
        		}
        	}
        	that.showView(searchElemPartList);
        } else {
        	that.showView(that.protocolElemsList);
        }
    });
};

//==============================================
function DataManager() {
    this.protocols = [];
};

DataManager.getSystemProtocolData = function(callback) {
	var that = this;
    $.get("/circuit/1", function(data, status) {
        that.protocols = data['protocol'];
        callback(that.protocols);
    });
};

DataManager.init = function() {
};


$('.menu .item')
  .tab()
;

$(function() {
	leftbar = new LeftBar();
	leftbar.init();
	DataManager.getSystemProtocolData(function(protocols) {
		leftbar.initProtocolElems(protocols);
	});
});

$("#moreInfor")
	.modal({closable: false,
			transition: 'horizontal flip'})
;

$(".more").click(function() {
	$("#moreInfor")
		.modal({closable: false,
				transition: 'horizontal flip'})
		.modal("show")
	;
});

$("#edit-protocol").click(function() {
	$(".remove-protocol").each(function() {
		$(this).toggle();
	});
	if ($(".remove-protocol:first").css("display") == "none") {
		$("#edit-protocol").css("color", "#EDEDEF");
	} else {
		$("#edit-protocol").css("color", "#72d3e3");
	}
});

$("#add-protocol").click(function() {
	$(".trigger-left").click();
});

$(".save-edit").each(function() {
	$(this).click(function() {
		if ($(this).find("i").hasClass("edit")) {
			// come in edit status
			$(this).find("i").removeClass("edit");
			$(this).find("i").addClass("save");
			var temp = $(this).find("i");
			$(this).empty();
			$(this).append(temp);
			$(this).append("Save");

			var contentElem = $(this).parents(".step-content").find("p");
			var content = contentElem.text();
			var textareaElem = $("<textarea></textarea>");
			textareaElem.attr("rows", "7");
			textareaElem.text(content);
			contentElem.replaceWith(textareaElem);
		} else {
			// come in save status
			$(this).find("i").removeClass("save");
			$(this).find("i").addClass("edit");
			var temp = $(this).find("i");
			$(this).empty();
			$(this).append(temp);
			$(this).append("Edit");

			var textareaElem = $(this).parents(".step-content").find("textarea");
			var content = textareaElem.text();
			var pElem = $("<p></p>");
			pElem.text(content);
			textareaElem.replaceWith(pElem);
		}
	});
});