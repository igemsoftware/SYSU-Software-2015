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

var leftBar;
var protocolList;

function LeftBar() {
    this.isOpenLeftBar = false;
    this._LeftBarWidth = 350;
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
	this.enableMoreBtn();
	this.enableAddProBtn();
};

LeftBar.prototype._leftTriggerAnimation = function() {
    var that = this;
    this.leftTrigger.click(function() {
        var left = that.view.css("left");
        if (parseInt(left) == 0) {
            that.isOpenLeftBar = false;
            that.view.animate({
                left: '-' + that._LeftBarWidth + 'px'
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

LeftBar.prototype.createProtocolView = function(protocol, index) {
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
	divElem.attr("index", index);
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

LeftBar.prototype.enableAddProBtn = function() {
	$(".addPro").click(function() {
		$("#confirmModal").modal("show");
		var index = $("#sysProMoreInfor").attr("index");
		var protocol = DataManager.getPerProtocols()[index];
		var addIndex = DataManager.getPerProLength();
		var protocolElem = protocolList.createProtocolView(protocol, addIndex);
		protocolList.addProtocolView(protocolElem);
		DataManager.addProtocol(protocol);
	});
}

LeftBar.prototype.enableMoreBtn = function() {
	$("#left-sidebar-body").find($(".more")).each(function() {
		$(this).click(function() {
			var index = $(this).parent(".item").attr("index");
			var protocol = DataManager.getSysProtocols()[index];
			$("#sysProMoreInfor .pro-title").text(protocol.name);
			$("#sysProMoreInfor .star").text(protocol.likes);
			$("#sysProMoreInfor .content .introduction").text(protocol.introduction);
			
			var ulElem = $("#sysProMoreInfor .content .component ul");
			ulElem.empty();
			for (var i in protocol.component) {
				if (protocol.component[i] == "") continue;
				var liElem = $("<li></li>");
				liElem.text(protocol.component[i]);
				liElem.appendTo(ulElem);
			}
			
			var proceduresElem = $("#sysProMoreInfor .content .procedures");
			proceduresElem.empty();
			// $("#sysProMoreInfor .content .procedure").text(protocol.procedure);
			for (var i in protocol.procedure) {
				if (protocol.procedure[i] == "") continue;
				var pElem = $("<p></p>");
				var procedureElem = $("<div></div>");
				procedureElem.addClass("procedure");
				pElem.text(protocol.procedure[i]);
				pElem.appendTo(procedureElem);
				procedureElem.appendTo(proceduresElem);
			}

			$("#sysProMoreInfor").attr("index", index);
			$("#sysProMoreInfor")
				.modal({closable: false,
						transition: 'horizontal flip'})
				.modal("show")
			;
		});
	});
}

//==============================================
function ProtocolList() {
}

ProtocolList.prototype.init = function() {
	this.enableMoreBtn();
	this.enableEditSaveBtn();
	this.enableRemoveBtn();
}

ProtocolList.prototype.createProtocolView = function(protocol, index) {
	var stepElem = $("<div></div>");
	stepElem.addClass("step");

	var removeSpan = $("<span></span>");
	var minusIconElem = $("<i></i>");
	minusIconElem.addClass("minus circle icon remove-protocol");
	removeSpan.append(minusIconElem);
	removeSpan.addClass("removeBtn");

	var stepNameElem = $("<span></span>");
	stepNameElem.text(protocol.name);
	stepNameElem.addClass("step-name");

	var iconsSetElem = this.crearteIconSet();

	stepElem.append(removeSpan);
	stepElem.append(stepNameElem);
	stepElem.append(iconsSetElem);
	stepElem.attr("index", index);

	return stepElem;
};

ProtocolList.prototype.crearteIconSet = function() {
	var iconsSetElem = $("<span></span>");
	var timeIconElem = $("<i></i>");
	var tagsIconElem = $("<i></i>");
	var moreIconElem = $("<i></i>");

	iconsSetElem.addClass("icon-set");
	timeIconElem.addClass("wait icon");
	tagsIconElem.addClass("tags icon");
	moreIconElem.addClass("zoom icon more");
	iconsSetElem.append(timeIconElem);
	iconsSetElem.append(tagsIconElem);
	iconsSetElem.append(moreIconElem);

	return iconsSetElem;
}

ProtocolList.prototype.addProtocolView = function(protocolElem) {
	$("#list-body").append(protocolElem);
	protocolElem.append('<div class="ui divider"></div>');
};

ProtocolList.prototype.initProtocolElems = function(protocols) {
	for (var i in protocols) {
		var protocolElem = this.createProtocolView(protocols[i], i);
		this.addProtocolView(protocolElem);
	}
}

ProtocolList.prototype.showView = function(protocolELems) {
	this.view.protocols.empty();
	for (var i in protocolELems) {
		this.addProtocolView(protocolELems[i], i);
	}
};

ProtocolList.prototype.enableMoreBtn = function() {
	$("#list-body").find($(".more")).each(function() {
		$(this).click(function() {
			var index = $(this).parent().parent(".step").attr("index");
			var protocol = DataManager.getPerProtocols()[index];
			$("#perProMoreInfor .pro-title").text(protocol.name);
			$("#perProMoreInfor .star").text(protocol.likes);
			$("#perProMoreInfor .content .introduction").text(protocol.introduction);
			
			var ulElem = $("#perProMoreInfor .content .component ul");
			ulElem.empty();
			for (var i in protocol.component) {
				if (protocol.component[i] == "") continue;
				var liElem = $("<li></li>");
				// console.log(protocol.component[i]);
				liElem.text(protocol.component[i]);
				liElem.appendTo(ulElem);
			}
			
			var proceduresElem = $("#perProMoreInfor .content .procedures");
			proceduresElem.empty();
			for (var i in protocol.procedure) {
				if (protocol.procedure[i] == "") continue;
				var pElem = $("<p></p>");
				var procedureElem = $("<div></div>");
				procedureElem.addClass("procedure");
				pElem.text(protocol.procedure[i]);
				pElem.appendTo(procedureElem);
				procedureElem.appendTo(proceduresElem);
			}

			$("#perProMoreInfor")
				.modal({closable: false,
						transition: 'horizontal flip'})
				.modal("show")
			;
		});
	});
}

ProtocolList.prototype.enableEditSaveBtn = function() {
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

				$(".procedures").find(".procedure").each(function() {
					var contentElem = $(this).find("p");
					var content = contentElem.text();
					var textareaElem = $("<textarea></textarea>");
					textareaElem.text(content);
					contentElem.replaceWith(textareaElem);
				})
			} else {
				// come in save status
				$(this).find("i").removeClass("save");
				$(this).find("i").addClass("edit");
				var temp = $(this).find("i");
				$(this).empty();
				$(this).append(temp);
				$(this).append("Edit");

				$(".procedures").find(".procedure").each(function() {
					var textareaElem = $(this).find("textarea");
					var content = textareaElem.text();
					var pElem = $("<p></p>");
					pElem.text(content);
					textareaElem.replaceWith(pElem);
				});
			}
		});
	});
}

ProtocolList.prototype.enableRemoveBtn = function() {
	$(".removeBtn").each(function() {
		$(this).click(function() {
			var step = $(this).parent();
			DataManager.deleteProtocolByIndex(step.attr("index"));
			step.remove();
		})
	})
}

//==============================================
function DataManager() {
    this.sysProtocols = [];
    this.perProtocols = [];
};

DataManager.getSysProtocolData = function(callback) {
	var that = this;
    $.get("/protocol", function(data, status) {
     	console.log(data);
        that.sysProtocols = data['protocols'];
        that.processSysData();
        console.log("System protocols:");
        console.log(that.sysProtocols);
        callback(that.sysProtocols);
    });
};

DataManager.getPerProtocolData = function(callback) {
	var that = this;
    $.get("/circuit/1", function(data, status) {
    	console.log(data);
        that.perProtocols = data['protocol'];
        that.processPerData();
        console.log("Personal protocols:");
        console.log(that.perProtocols);
        callback(that.perProtocols);
    });
};

DataManager.processSysData = function() {
	for (var i in this.sysProtocols) {
		this.sysProtocols[i].component = String(this.sysProtocols[i].component).split("\n");
		this.sysProtocols[i].procedure = String(this.sysProtocols[i].procedure).split("\n");
	}
}

DataManager.processPerData = function() {
	for (var i in this.sysProtocols) {
		this.perProtocols[i].component = String(this.perProtocols[i].component).split("\n");
		this.perProtocols[i].procedure = String(this.perProtocols[i].procedure).split("\n");
	}
}

DataManager.getPerProLength = function() {
	return this.perProtocols.length
}

DataManager.getSysProtocols = function() {
	return this.sysProtocols;
}

DataManager.getPerProtocols = function() {
	return this.perProtocols;
}

DataManager.deleteProtocolByIndex = function(index) {
	this.perProtocols.splice(index, 1);
	console.log(this.perProtocols);
}

DataManager.addProtocol = function(protocol) {
	this.perProtocols.push(protocol);
}

DataManager.init = function() {
};


$(function() {
	leftBar = new LeftBar();
	protocolList = new ProtocolList();
	DataManager.getSysProtocolData(function(protocols) {
		leftBar.initProtocolElems(protocols);
		leftBar.init();
	});
	DataManager.getPerProtocolData(function(protocols) {
		protocolList.initProtocolElems(protocols);
		protocolList.init();
		rightBar.initProtocol();
	});
});

$('.menu .item')
  .tab()
;

$("#sysProMoreInfor")
	.modal({closable: false,
			transition: 'horizontal flip'})
;

$(".more").click(function() {
	$("#sysProMoreInfor")
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

$(".confirmButton").click(function() {
	$('.modal').modal("hide");
});