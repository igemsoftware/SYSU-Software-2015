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
	// this.enableSearchBox();
	this.enableMoreBtn();
	// this.enableAddProBtn();
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

LeftBar.prototype.createProtocolView = function(protocol) {
	var divElem = $("<div></div>");
	var starIconElem = $("<i></i>");
	var zoomIconElem =  $("<i></i>");
	var titleSpanElem = $("<span></span>");
	var likesSpanElem = $("<span></span>");

	divElem.addClass("item");

	starIconElem.addClass("empty star icon");
	likesSpanElem.addClass("likes");
	likesSpanElem.text(protocol.likes);
	zoomIconElem.addClass("zoom icon more");
	titleSpanElem.text(protocol.name);
	titleSpanElem.addClass("protocolTitle");

	divElem.append(titleSpanElem);
	divElem.append(zoomIconElem);
	divElem.append(starIconElem);
	divElem.append(likesSpanElem);
	divElem.attr("index", protocol.id);
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

// LeftBar.prototype.enableSearchBox = function() {
//     var that = this;
//     this.view.searchPro.keyup(function() {
//     	var val = that.view.searchPro.val().toLowerCase();
//         if (val != "") {
//         	var searchElemPartList = [];
//         	for (var i in that.protocolElemsList) {
//         		var title = $(that.protocolElemsList[i].find(".protocolTitle")[0]).text().toLowerCase();
//         		if (title.indexOf(val) != -1) {
//         			searchElemPartList.push(that.protocolElemsList[i]);
//         		}
//         	}
//         	that.showView(searchElemPartList);
//         } else {
//         	that.showView(that.protocolElemsList);
//         }
//     });
// };

// LeftBar.prototype.enableAddProBtn = function() {
// 	$(".addPro").click(function() {
// 		$("#confirmModal").modal("show");
// 		var index = $("#sysProMoreInfor").attr("index");
// 		var protocol = DataManager.getPerProtocols()[index];
// 		var addIndex = DataManager.getPerProLength();
// 		var protocolElem = protocolList.createProtocolView(protocol, addIndex);
// 		protocolList.addProtocolView(protocolElem);
// 		DataManager.addProtocol(protocol);
// 	});
// }

LeftBar.prototype.enableMoreBtn = function() {
	$("#left-sidebar-body").find($(".more")).each(function() {
		$(this).click(function() {
			var index = $(this).parent(".item").attr("index");
			var protocol = DataManager.getSetBProtocolById(index]);
			ModalManager.showMoreInforModal(protocol, true);
			// var index = $(this).parent(".item").attr("index");
			// var protocol = DataManager.getsetBProtocols()[index];
			// $("#sysProMoreInfor .pro-title").text(protocol.name);
			// $("#sysProMoreInfor .star").text(protocol.likes);
			// $("#sysProMoreInfor .content .introduction").text(protocol.introduction);
			
			// var ulElem = $("#sysProMoreInfor .content .component ul");
			// ulElem.empty();
			// for (var i in protocol.component) {
			// 	if (protocol.component[i] == "") continue;
			// 	var liElem = $("<li></li>");
			// 	liElem.text(protocol.component[i]);
			// 	liElem.appendTo(ulElem);
			// }
			
			// var proceduresTbodyElem = $("#sysProMoreInfor .content .procedures tbody");
			// proceduresTbodyElem.empty();
			// for (var i in protocol.procedure) {
			// 	if (protocol.procedure[i] == "") continue;
			// 	var proTd = $("<td></td>");
			// 	var timeTd = $("<td></td>");
			// 	var noteTd = $("<td></td>");
			// 	var tr = $("<tr></tr>");

			// 	proTd.text(protocol.procedure[i].procedure);
			// 	timeTd.text(protocol.procedure[i].time);
			// 	noteTd.text(protocol.procedure[i].annotation);

			// 	tr.append(proTd);
			// 	tr.append(timeTd);
			// 	tr.append(noteTd);
			// 	tr.appendTo(proceduresTbodyElem);
			// }

			// var totalTime = $(".totalTime span");
			// console.log(getTotalTime(protocol.procedure));
			// totalTime.text(getTotalTime(protocol.procedure));

			// $("#sysProMoreInfor").attr("index", index);
			// $("#sysProMoreInfor")
			// 	.modal({closable: false,
			// 			transition: 'horizontal flip'})
			// 	.modal("show")
			// ;
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
	this.enableAddCalendar();
}

ProtocolList.prototype.createProtocolView = function(protocol) {
	var itemElem = $("<div></div>");
	itemElem.addClass("item");

	var removeSpan = $("<span></span>");
	var minusIconElem = $("<i></i>");
	minusIconElem.addClass("minus circle icon remove-protocol");
	removeSpan.append(minusIconElem);
	removeSpan.addClass("removeBtn");

	var itemNameElem = $("<span></span>");
	itemNameElem.text(protocol.name);
	itemNameElem.addClass("item-name");

	var iconsSetElem = this.crearteIconSet(protocol);

	itemElem.append(removeSpan);
	itemElem.append(itemNameElem);
	itemElem.append(iconsSetElem);
	itemElem.attr("index", protocol.id);

	return itemElem;
};

ProtocolList.prototype.crearteIconSet = function(protocol) {
	var iconsSetElem = $("<span></span>");
	var timeIconElem = $("<i></i>");
	var tagsIconElem = $("<i></i>");
	var moreIconElem = $("<i></i>");

	iconsSetElem.addClass("icon-set");
	timeIconElem.addClass("wait icon");
	timeIconElem.attr("data-content", getTotalTime(protocol.procedure));
	timeIconElem.popup();
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
			var index = $(this).parent().parent(".item").attr("index");
			var protocol = DataManager.getSetAProtocolById(index);
			ModalManager.showMoreInforModal(protocol, false);
		});
	});
}

ProtocolList.prototype.enableEditSaveBtn = function() {
	$("#save-edit").click(function() {
		if ($(this).find("i").hasClass("edit")) {
			this.editStatus($(this));
		} else {
			this.saveStatus($(this));
		}
	});
}

ProtocolList.prototype.saveStatus = function(btn) {
	// come in save status
	btn.find("i").removeClass("save");
	btn.find("i").addClass("edit");
	var temp = btn.find("i");
	btn.empty();
	btn.append(temp);
	btn.append("Edit");

	$(".procedures").find(".procedure").each(function() {
		var textareaElem = btn.find("textarea");
		var content = textareaElem.text();
		var pElem = $("<p></p>");
		pElem.text(content);
		textareaElem.replaceWith(pElem);
	});
}

ProtocolList.prototype.editStatus = function(btn) {
		// come in edit status
	btn.find("i").removeClass("edit");
	btn.find("i").addClass("save");
	var temp = btn.find("i");
	btn.empty();
	btn.append(temp);
	btn.append("Save");

	$(".procedures").find(".procedure").each(function() {
		var contentElem = btn.find("p");
		var content = contentElem.text();
		var textareaElem = $("<textarea></textarea>");
		textareaElem.text(content);
		contentElem.replaceWith(textareaElem);
	})
}

ProtocolList.prototype.enableRemoveBtn = function() {
	$(".removeBtn").each(function() {
		$(this).click(function() {
			var item = $(this).parent();
			DataManager.deleteProtocolByIndex(item.attr("index"));
			item.remove();
		})
	})
}

ProtocolList.prototype.enableAddCalendar = function() {
	$("#addCalendar").click(function() {
		var inforElem = $(this).parents("#moreIndorModal");
		var title = inforElem.find(".pro-title").text();
		var items = $('#eventProtocol').parent().find(".item");

		$(items).each(function() {
			$(this).attr("data-value")
			if ($(this).attr("data-value") == title) {
				$('#eventProtocol').parent().find(".selected").removeClass("selected active");
				$('#eventProtocol').parent().find(".text").text(title);
				$(this).addClass("selected active");
			}
		});

		$("#calendar-menu").addClass("active");
		$("#protocol-menu").removeClass("active");
		$("#calendar-box").addClass("active");
		$("#PlaPro").removeClass("active");

		$("#moreIndorModal").modal("hide");
		rightBar.openRightBar("create");
	});
}

//===========================================================================

function ModalManager() {
}

ModalManager.showMoreInforModal = function(protocol, isSetB) {
	$("#moreIndorModal .pro-title").text(protocol.name);
	$("#moreIndorModal .star").text(protocol.likes);
	$("#moreIndorModal .content .introduction").text(protocol.introduction);
	
	this.renderComponent(protocol)
	this.renderTable(protocol);

	if (isSetB == true) {
		$("#moreIndorModal .icon-set").hide();
	} else {
		$("#moreIndorModal .icon-set").show();
	}

	var totalTime = $(".totalTime span");
	totalTime.text(getTotalTime(protocol.procedure));

	$("#moreIndorModal")
		.modal({closable: false,
				transition: 'horizontal flip'})
		.modal("show")
	;
}

ModalManager.renderComponent = function(protocol) {
	var ulElem = $("#moreIndorModal .content .component ul");
	ulElem.empty();
	for (var i in protocol.component) {
		if (protocol.component[i] == "") continue;
		var liElem = $("<li></li>");
		liElem.text(protocol.component[i]);
		liElem.appendTo(ulElem);
	}
}

ModalManager.renderTable = function(protocol) {
	var proceduresTbodyElem = $("#moreIndorModal .content .procedures tbody");
	proceduresTbodyElem.empty();
	for (var i in protocol.procedure) {
		if (protocol.procedure[i] == "") continue;
		var proTd = $("<td></td>");
		var timeTd = $("<td></td>");
		var noteTd = $("<td></td>");
		var tr = $("<tr></tr>");

		proTd.text(protocol.procedure[i].procedure);
		timeTd.text(protocol.procedure[i].time);
		noteTd.text(protocol.procedure[i].annotation);

		tr.append(proTd);
		tr.append(timeTd);
		tr.append(noteTd);
		tr.appendTo(proceduresTbodyElem);
	}
}

//==============================================
function DataManager() {
    this.setAProtocols = [];
    this.setBProtocols = [];
    this.perProtocols = [];
};

DataManager.getSysProtocolData = function(callback) {
	var that = this;
    $.get("/protocol", function(data, status) {
        that.processData(data['protocols']);
        console.log("System protocols:");
        console.log(that.setAProtocols);
        console.log(that.setBProtocols);
        that.perProtocols = that.setAProtocols;
        callback(that.setBProtocols, that.setAProtocols);
    });
};

// DataManager.getPerProtocolData = function(callback) {
// 	var that = this;
//     $.get("/circuit/1", function(data, status) {
//         that.perProtocols = data['protocol'];
//         console.log("Personal protocols:");
//         console.log(that.perProtocols);
//         callback(that.perProtocols);
//     });
// };

DataManager.processData = function(data) {
	this.setBProtocols = [];
	this.setAProtocols = [];
	for (var i in data) {
		if (data[i].setB == true) {
			this.setBProtocols.push(data[i]);
		} else {
			this.setAProtocols.push(data[i]);
		}
 	}
}

DataManager.getPerProLength = function() {
	return this.perProtocols.length
}

DataManager.getSetAProtocolById = function(id) {
	for (var i in this.setAProtocols) {
		if (this.setAProtocols[i].id == id) {
			return this.setAProtocols[i];
		}
	}
}

DataManager.getSetBProtocolById = function(id) {
	for (var i in this.setBProtocols) {
		if (this.setBProtocols[i].id == id) {
			return this.setBProtocols;
		}
	}
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

function getSec(time) {
	if (time.indexOf("s") != -1) {
		return parseInt(time, 10);	
	} else if (time.indexOf("min") != -1) {
		return parseInt(time, 10) * 60;
	} else if (time.indexOf("hr") != -1) {
		return parseInt(time, 10) * 60 * 60;
	}
}

function getTotalTime(procedures) {
	var total = 0;
	for (var i in procedures) {
		var time = getSec(procedures[i].time);
		total += time;
	}
	if (total >= 60 && total < 3600) {
		return String(parseInt(total/60)) + "min";
	} else if (total >= 3600) {
		var hr = 0;
		var min = 0;
		for (var i = 0; total > 3600; i++) {
			hr += 1;
			total -= 3600;
		}
		for (var i = 0; total > 60; i++) {
			min += 1;
			total -= 60;
		}
		if (min == 0) {
			return String(Math.ceil(hr)) + "hr"
		}
		return String(Math.ceil(hr)) + "hr " + String(Math.ceil(min)) + "min"
	}
	return "Zero"
}

$(function() {
	leftBar = new LeftBar();
	protocolList = new ProtocolList();
	DataManager.getSysProtocolData(function(protocolB, protocolA) {
		leftBar.initProtocolElems(protocolB);
		leftBar.init();

		rightBar.initProtocol();
		protocolList.initProtocolElems(protocolA);
		protocolList.init();
	});
	// DataManager.getPerProtocolData(function(protocols) {
	// 	protocolList.initProtocolElems(protocols);
	// 	protocolList.init();
	// 	rightBar.initProtocol();
	// });
});

$('.menu .item')
  .tab()
;

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