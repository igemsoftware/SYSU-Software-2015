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
		var protocolElem = this.createProtocolView(protocols[i]);
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
			var protocol = DataManager.getSetBProtocolById(index);
			$("#moreIndorModal").attr("index", index);
			ModalManager.showMoreInforModal(protocol, true);
		});
	});
}

//==============================================
function ProtocolList() {
}

ProtocolList.prototype.init = function() {
	// this.enableMoreBtns();
	// this.enableRemoveBtn();
	this.enableEditProtocolBtn();
	this.enableAddProBtn();
}

ProtocolList.prototype.createProtocolView = function(protocol) {
	var itemElem = $("<div></div>");
	itemElem.addClass("item");

	var removeSpan = $("<span></span>");
	var minusIconElem = $("<i></i>");
	minusIconElem.addClass("minus circle icon remove-protocol");
	removeSpan.append(minusIconElem);
	removeSpan.addClass("removeBtn");
	this.enableRemoveBtn(removeSpan);

	var itemNameElem = $("<span></span>");
	itemNameElem.text(protocol.name);
	itemNameElem.addClass("item-name");

	var iconsSetElem = this.createIconSet(protocol);

	itemElem.append(removeSpan);
	itemElem.append(itemNameElem);
	itemElem.append(iconsSetElem);
	itemElem.attr("index", protocol.id);

	return itemElem;
};

ProtocolList.prototype.createIconSet = function(protocol) {
	var iconsSetElem = $("<span></span>");
	var timeIconElem = $("<i></i>");
	var tagsIconElem = $("<i></i>");
	var moreIconElem = $("<i></i>");

	iconsSetElem.addClass("icon-set");
	timeIconElem.addClass("wait icon");
	timeIconElem.attr("data-content", getTotalTime(protocol.procedure));
	timeIconElem.popup();
	tagsIconElem.addClass("tags icon");
	moreIconElem.addClass("edit icon more");
	iconsSetElem.append(timeIconElem);
	iconsSetElem.append(tagsIconElem);
	iconsSetElem.append(moreIconElem);

	this.enableMoreBtn(moreIconElem);

	return iconsSetElem;
}

ProtocolList.prototype.addProtocolView = function(protocolElem) {
	$("#list-body").append(protocolElem);
	protocolElem.append('<div class="ui divider"></div>');
};

ProtocolList.prototype.initProtocolElems = function(protocols) {
	for (var i in protocols) {
		var protocolElem = this.createProtocolView(protocols[i]);
		this.addProtocolView(protocolElem);
	}
}

ProtocolList.prototype.showView = function(protocolELems) {
	this.view.protocols.empty();
	for (var i in protocolELems) {
		this.addProtocolView(protocolELems[i], i);
	}
};

// ProtocolList.prototype.enableMoreBtns = function() {
// 	var that = this;
// 	$("#list-body").find($(".more")).each(function() {
// 		that.enableMoreBtn($(this));
// 	});
// }

ProtocolList.prototype.enableMoreBtn = function(btn) {
	btn.click(function() {
		var index = btn.parents(".item").attr("index");
		$("#moreIndorModal").attr("index", index);
		var protocol = DataManager.getPerProtocolById(index);
		ModalManager.showMoreInforModal(protocol, false);
	});
}


// ProtocolList.prototype.enableRemoveBtns = function() {
// 	var that = this;
// 	$(".removeBtn").each(function() {
// 		that.enableMoreBtn($(this));
// 	});
// };

ProtocolList.prototype.enableRemoveBtn = function(btn) {
	btn.click(function() {
		var item = btn.parent();
		$("#deleteModal").modal('show');
		$("#deleteBtn").click(function() {
			DataManager.deleteProtocolById(item.attr("index"));
			item.remove();
			$("#deleteModal").modal('hide');
		});
	});
};

ProtocolList.prototype.enableEditProtocolBtn = function() {
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
}

ProtocolList.prototype.enableAddProBtn = function() {
	$("#add-protocol").click(function() {
		$("#createProtocol")
			.modal({closable: false,
				transition: 'horizontal flip'})
			.modal("show");
	});
}

//===========================================================================

function ModalManager() {
}

ModalManager.init = function() {
	this.enablePlusLi();
	this.enablePlusTableRow();
	this.enableEditSaveBtn();
	this.enableCreateProBtn();
	this.enableAddCalendar();
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
		proTd.addClass("procedure");
		timeTd.text(protocol.procedure[i].time);
		timeTd.addClass("time");
		noteTd.text(protocol.procedure[i].annotation);
		noteTd.addClass("annotation");

		tr.append(proTd);
		tr.append(timeTd);
		tr.append(noteTd);
		tr.appendTo(proceduresTbodyElem);
	}
}

ModalManager.enableEditSaveBtn = function() {
	var that = this;
	$("#save-edit").click(function() {
		if ($(this).find("i").hasClass("edit")) {
			that.editStatus($(this));
		} else {
			that.saveStatus($(this));
		}
	});
}

ModalManager.saveStatus = function(btn) {
	var that = this;
	// come in save status
	btn.find("i").removeClass("save");
	btn.find("i").addClass("edit");
	var temp = btn.find("i");
	btn.empty();
	btn.append(temp);
	btn.append("Edit");

	$(".procedures td").each(function() {
		that.changeToText($(this));
	});

	$(".component ul li").each(function() {
		that.changeToText($(this));
	});
	this.changeToText($(".introduction"));
	this.changeToText($(".pro-title"));

	this.updateProtocolById($("#moreIndorModal").attr("index"));
}

ModalManager.editStatus = function(btn) {
	// come in edit status
	var that = this;
	btn.find("i").removeClass("edit");
	btn.find("i").addClass("save");
	var temp = btn.find("i");
	btn.empty();
	btn.append(temp);
	btn.append("Save");

	$(".procedures td").each(function() {
		that.changeToTextarea($(this));
	})

	$(".component ul li").each(function() {
		that.changeToTextarea($(this));
	});
	this.changeToTextarea($(".introduction"));
	this.changeToTextarea($(".pro-title"));
}

ModalManager.updateProtocolById = function(id) {
	var protocol = DataManager.getPerProtocolById(id);
	var name = $(".pro-title").text();
	var introduction = $(".introduction").text();
	var component = [];
	var procedures = [];
	
	$(".component ul li").each(function() {
		component.push($(this).text())
	});

	$(".procedures tr").each(function() {
		var procedure = {};
		procedure.time = $(this).find(".time").text();
		procedure.annotation = $(this).find(".annotation").text();
		procedure.procedure = $(this).find(".procedure").text();
		procedures.push(procedure);
	});

	protocol.name = name;
	protocol.introduction = introduction;
	protocol.component = component;
	protocol.procedure = procedures;

	DataManager.syncProtocol(); 
}

ModalManager.changeToTextarea = function(sourceElem) {
	var textarea = $("<textarea></textarea>");
	textarea.text(sourceElem.text());
	sourceElem.empty();
	sourceElem.append(textarea);
};

ModalManager.changeToText = function(sourceElem) {
	var textarea = sourceElem.find("textarea");
	var content = textarea.val();
	sourceElem.text(content);
};

ModalManager.enablePlusLi = function() {
	$("#plusLi").click(function() {
		var liElem = $('<li><input type="text"></li>');
		$("#createProtocol ul").append(liElem);
	});
}

ModalManager.enablePlusTableRow = function() {
	$("#plusTableRow").click(function() {
		var td1 = $("<td></td>");
		var td2 = $("<td></td>");
		var td3 = $("<td></td>");
		td1.append('<input type="text" class="procedure">');
		td2.append('<input type="text" class="time">');
		td3.append('<input type="text" class="annotation">');
		var tr = $("<tr></tr>");
		tr.append(td1);
		tr.append(td2);
		tr.append(td3);
		$("#createProtocol table tbody").append(tr);
	});
}

ModalManager.enableCreateProBtn = function() {
	$("#createProBtn").click(function() {
		var protocol = {};
		protocol.introduction = $("#createProtocol textarea").val();
		protocol.name = $("#createProtocol .c-title").val();
		console.log("name:"+ protocol.name);

		var component = [];
		$("#createProtocol ul li").each(function() {
			component.push($(this).find("input").val());
		});
		protocol.component = component;

		var procedures = [];
		$("#createProtocol table tbody tr").each(function() {
			var procedure = {};
			procedure.annotation = $(this).find(".annotation").val();
			procedure.time = $(this).find(".time").val();
			procedure.procedure = $(this).find(".procedure").val();
			if (!(procedure.annotation.replace(/\s+/g,"") == ""
				&& procedure.time.replace(/\s+/g,"") == ""
				&& procedure.procedure.replace(/\s+/g,"") == "")) {
				procedures.push(procedure);
			}
		});
		protocol.procedure = procedures;
		protocol.id = DataManager.getNewId();

		var protocolElem = protocolList.createProtocolView(protocol);
		protocolList.addProtocolView(protocolElem);

		DataManager.addProtocol(protocol);
		DataManager.syncProtocol();

		$("#createProtocol").modal('hide');
	});
}

ModalManager.enableAddCalendar = function() {
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

//==============================================
function DataManager() {
    this.setAProtocols = [];
    this.setBProtocols = [];
    this.perProtocols = [];
};

DataManager.getNewId = function() {
	this.newId -= 1;
	return this.newId;
}

DataManager.getSysProtocolData = function(callback) {
	var that = this;
    $.get("/protocol/setB", function(data, status) {
    	console.log(data['protocols']);
        that.setBProtocols = data['protocols'];
        callback(that.setBProtocols);
    });
};

DataManager.getPerProtocolData = function(callback) {
	this.newId = 0;
	var that = this;
    $.get("/protocol/circuit/1", function(data, status) {
    	console.log(data['protocols']);
        that.perProtocols = data['protocols'];
        callback(that.perProtocols);
    });
};

DataManager.getPerProLength = function() {
	return this.perProtocols.length
}

DataManager.getPerProtocolById = function(id) {
	for (var i in this.perProtocols) {
		if (this.perProtocols[i].id == id) {
			return this.perProtocols[i];
		}
	}
}

DataManager.getSetBProtocolById = function(id) {
	console.log(id);
	for (var i in this.setBProtocols) {
		if (this.setBProtocols[i].id == id) {
			return this.setBProtocols[i];
		}
	}
}

DataManager.getPerProtocols = function() {
	return this.perProtocols;
}

DataManager.deleteProtocolById = function(id) {
	for (var i in this.perProtocols) {
		if (this.perProtocols[i].id == id) {
			this.perProtocols.splice(i, 1);
		}
	}
	this.syncProtocol();
}

DataManager.addProtocol = function(protocol) {
	this.perProtocols.push(protocol);
}

DataManager.syncProtocol = function(id) {
	id = 1;
	var that = this;
	var postDataJson = JSON.stringify(that.perProtocols);
	$.ajax({
	    type: 'POST',
	    contentType: 'application/json',
	    url: '/protocol/circuit/'+id,
	    dataType : 'json',
	    data : postDataJson,
	});
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
	DataManager.getSysProtocolData(function(protocols) {
		console.log(protocols);
		leftBar.initProtocolElems(protocols);
		leftBar.init();

		// rightBar.initProtocol();
		// protocolList.initProtocolElems(protocolA);
	});
	DataManager.getPerProtocolData(function(protocols) {
		protocolList.initProtocolElems(protocols);
		protocolList.init();
		rightBar.initProtocol();
	});
	ModalManager.init();
});

$('.menu .item')
  .tab()
;

// $(".confirmButton").click(function() {
// 	$('.modal').modal("hide");
// });

$(".cancel").click(function() {
	$(".modal").modal("hide");
});