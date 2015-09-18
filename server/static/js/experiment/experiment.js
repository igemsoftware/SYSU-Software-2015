/**
 * @file experiment.js
 * @description /experiment page javascript code
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @data Aug 30 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict";

var leftBar;
var protocolList;

/**
 * @class LeftBar
 * @method constructor
 *
 */
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


/**
 * Init the left bar
 * @method init
 * @for LeftBar
 * 
 */
LeftBar.prototype.init = function() {
	this._leftTriggerAnimation();
	this.enableMoreBtn();
};

/**
 * Enable left-bar trigger animation
 * @method _leftTriggerAnimation
 * @for LeftBar
 * 
 */
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

/**
 * Create protocol view
 * @method createProtocolView
 * @for LeftBar
 * @param {Json} Protocol A protocol
 * 
 */
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

/**
 * Add protocol view
 * @method addProtocolView
 * @for LeftBar
 * @param {elem} protocolElem A protocol element
 * 
 */
LeftBar.prototype.addProtocolView = function(protocolElem) {
	protocolElem.appendTo($("#left-sidebar-body"));
};

/**
 * Init protocols view
 * @method initProtocolElems
 * @for LeftBar
 * @param {List} protocols A protocol List
 * 
 */
LeftBar.prototype.initProtocolElems = function(protocols) {
	for (var i in protocols) {
		var protocolElem = this.createProtocolView(protocols[i]);
		this.addProtocolView(protocolElem);
	}
}

/**
 * Show protocol view
 * @method showView
 * @for LeftBar
 * @param {elem} protocolELems A list of protocol element
 * 
 */
LeftBar.prototype.showView = function(protocolELems) {
	this.view.protocols.empty();
	for (var i in protocolELems) {
		this.addProtocolView(protocolELems[i], i);
	}
};

/**
 * Enable more button
 * @method enableMoreBtn
 * @for LeftBar
 * 
 */
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

//===============================================================
/**
 * @class ProtocolList
 * @method constructor
 *
 */
function ProtocolList() {
}

/**
 * Init the protocols list
 * @method ProtocolList
 * @for LeftBar
 * 
 */
ProtocolList.prototype.init = function() {
	this.enableEditProtocolBtn();
	this.enableAddProBtn();
}

/**
 * Create a protocol view
 * @method createProtocolView
 * @for ProtocolList
 * @param {json} protocol A protocol data structure
 * 
 */
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

/**
 * Create a design operable node
 * @method constructor
 * @for ProtocolList
 * @param {elem} partElem A part dom element
 * 
 */
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

/**
 * Add protocol view
 * @method addProtocolView
 * @for ProtocolList
 * @param {elem} protocolElem A protocol dom element
 * 
 */
ProtocolList.prototype.addProtocolView = function(protocolElem) {
	$("#list-body").append(protocolElem);
	protocolElem.append('<div class="ui divider"></div>');
};

/**
 * Init the protocol element
 * @method initProtocolElems
 * @for ProtocolList
 * @param {List} protocols A list of protocols
 * 
 */
ProtocolList.prototype.initProtocolElems = function(protocols) {
	for (var i in protocols) {
		var protocolElem = this.createProtocolView(protocols[i]);
		this.addProtocolView(protocolElem);
	}
}

/**
 * Create a design operable node
 * @method constructor
 * @for ProtocolList
 * @param {elem} partElem A part dom element
 * 
 */
ProtocolList.prototype.showView = function(protocolELems) {
	this.view.protocols.empty();
	for (var i in protocolELems) {
		this.addProtocolView(protocolELems[i], i);
	}
};

/**
 * Enable more button
 * @method enableMoreBtn
 * @for ProtocolList
 * @param {elem} btn A button dom element
 * 
 */
ProtocolList.prototype.enableMoreBtn = function(btn) {
	btn.click(function() {
		var index = btn.parents(".item").attr("index");
		$("#moreIndorModal").attr("index", index);
		var protocol = DataManager.getPerProtocolById(index);
		ModalManager.showMoreInforModal(protocol, false);
	});
}

/**
 * Enable remove button
 * @method enableRemoveBtn
 * @for ProtocolList
 * @param {elem} btn A button dom element
 * 
 */
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

/**
 * Enable edit protocol button
 * @method enableEditProtocolBtn
 * @for ProtocolList
 * 
 */
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

/**
 * Enable add protocol button
 * @method enableAddProBtn
 * @for ProtocolList
 * 
 */
ProtocolList.prototype.enableAddProBtn = function() {
	$("#add-protocol").click(function() {
		$("#createProtocol")
			.modal({closable: false,
				transition: 'horizontal flip'})
			.modal("show");
	});
}

//===========================================================================
/**
 * @class ModalManager
 * @method constructor
 *
 */
function ModalManager() {
}

/**
 * Init all the modal
 * @method init
 * @for ModalManager
 * 
 */
ModalManager.init = function() {
	this.enablePlusLi();
	this.enablePlusTableRow();
	this.enableEditSaveBtn();
	this.enableCreateProBtn();
	this.enableAddCalendar();
}

/**
 * Show more information modal
 * @method showMoreInforModal
 * @for ModalManager
 * @param {json} protocol A protocol data structure
 * @param {boolean} isSetB True when the protocol belong to setB
 * 
 */
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

/**
 * Render component
 * @method renderComponent
 * @for ModalManager
 * @param {json} protocol A protocol data structure
 * 
 */
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

/**
 * Render table
 * @method renderTable
 * @for ModalManager
 * @param {json} protocol A protocol data structure
 * 
 */
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

/**
 * Enable edit and save button
 * @method enableEditSaveBtn
 * @for ModalManager
 * 
 */
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

/**
 * Save status
 * @method saveStatus
 * @for ModalManager
 * @param {elem} btn A button dom element
 *
 */
ModalManager.saveStatus = function(btn) {
	var that = this;
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

/**
 * Edit status
 * @method editStatus
 * @for ModalManager
 * @param {elem} btn A button dom element
 *
 */
ModalManager.editStatus = function(btn) {
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

/**
 * Update protocol by id
 * @method updateProtocolById
 * @for ModalManager
 * @param {number} id A protocol id
 *
 */
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

	DataManager.syncProtocols(); 
}

/**
 * Change elements to textarea
 * @method changeToTextarea
 * @for ModalManager
 * @param {elem} sourceElem A dom element
 *
 */
ModalManager.changeToTextarea = function(sourceElem) {
	var textarea = $("<textarea></textarea>");
	textarea.text(sourceElem.text());
	sourceElem.empty();
	sourceElem.append(textarea);
};

/**
 * Change elements to text
 * @method changeToText
 * @for ModalManager
 * @param {elem} sourceElem A dom element
 *
 */
ModalManager.changeToText = function(sourceElem) {
	var textarea = sourceElem.find("textarea");
	var content = textarea.val();
	sourceElem.text(content);
};

/**
 * Enable plus element
 * @method enablePlusLi
 * @for ModalManager
 *
 */
ModalManager.enablePlusLi = function() {
	$("#plusLi").click(function() {
		var liElem = $('<li><input type="text"></li>');
		$("#createProtocol ul").append(liElem);
	});
}

/**
 * Enable plus table row button
 * @method enablePlusTableRow
 * @for ModalManager
 *
 */
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

/**
 * Enable create protocol button
 * @method enableCreateProBtn
 * @for ModalManager
 *
 */
ModalManager.enableCreateProBtn = function() {
	$("#createProBtn").click(function() {
		var protocol = {};
		protocol.introduction = $("#createProtocol textarea").val();
		protocol.name = $("#createProtocol .c-title").val();
		
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
		DataManager.syncProtocols();

		$("#createProtocol").modal('hide');
	});
}

/**
 * Enable add protocol to calendar button
 * @method enableAddCalendar
 * @for ModalManager
 *
 */
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

//=====================================================================
/**
 * @class DataManager
 * @method constructor
 *
 */
function DataManager() {
    this.setAProtocols = [];
    this.setBProtocols = [];
    this.perProtocols = [];
};

/**
 * Get a new id
 * @method getNewId
 * @for DataManager
 * 
 */

DataManager.getNewId = function() {
	this.newId -= 1;
	return this.newId;
}

/**
 * Get system protocol data
 * @method getSysProtocolData
 * @for DataManager
 * @param {function} callback Use this callback to process the getting data
 * 
 */
DataManager.getSysProtocolData = function(callback) {
	var that = this;
    $.get("/protocol/setB", function(data, status) {
        that.setBProtocols = data['protocols'];
        callback(that.setBProtocols);
    });
};

/**
 * Get personal protocol data
 * @method getPerProtocolData
 * @for DataManager
 * @param {function} callback Use this callback to process the getting data
 * 
 */
DataManager.getPerProtocolData = function(callback) {
	this.newId = 0;
	var that = this;
    $.get("/protocol/design/"+$.getUrlParam('id'), function(data, status) {
        that.perProtocols = data['protocols'];
        callback(that.perProtocols);
    });
};

/**
 * Get personal protocol by id
 * @method getPerProtocolById
 * @for DataManager
 * @param {number} id A protocol id
 * 
 */
DataManager.getPerProtocolById = function(id) {
	for (var i in this.perProtocols) {
		if (this.perProtocols[i].id == id) {
			return this.perProtocols[i];
		}
	}
}

/**
 * Get setB protocol by id
 * @method getSetBProtocolById
 * @for DataManager
 * @param {number} id A protocol id
 * 
 */
DataManager.getSetBProtocolById = function(id) {
	for (var i in this.setBProtocols) {
		if (this.setBProtocols[i].id == id) {
			return this.setBProtocols[i];
		}
	}
}

/**
 * Delete protocol by id
 * @method deleteProtocolById
 * @for DataManager
 * @param {number} id A protocol id
 * 
 */
DataManager.deleteProtocolById = function(id) {
	for (var i in this.perProtocols) {
		if (this.perProtocols[i].id == id) {
			this.perProtocols.splice(i, 1);
		}
	}
	this.syncProtocols();
}

/**
 * Add protocol to personal protocols
 * @method deleteProtocolById
 * @for DataManager
 * @param {json} protocol A protocol
 * 
 */
DataManager.addProtocol = function(protocol) {
	this.perProtocols.push(protocol);
}

/**
 * SYNC the protocol
 * @method syncProtocols
 * @for DataManager
 * 
 */
DataManager.syncProtocols = function() {
	var that = this;
	var postDataJson = JSON.stringify(that.perProtocols);
	$.ajax({
	    type: 'POST',
	    contentType: 'application/json',
	    url: '/protocol/design/'+$.getUrlParam('id'),
	    dataType : 'json',
	    data : postDataJson,
	});
}

/**
 * Get seconds
 * @method getSec
 * @param {string} time
 * 
 */
function getSec(time) {
	if (time.indexOf("s") != -1) {
		return parseInt(time, 10);	
	} else if (time.indexOf("min") != -1) {
		return parseInt(time, 10) * 60;
	} else if (time.indexOf("hr") != -1) {
		return parseInt(time, 10) * 60 * 60;
	}
}

/**
 * Get the procedures total time
 * @method getTotalTime
 * @param {json} procedures
 * 
 */
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
		leftBar.initProtocolElems(protocols);
		leftBar.init();
	});
	DataManager.getPerProtocolData(function(protocols) {
		protocolList.initProtocolElems(protocols);
		protocolList.init();
		rightBar.initProtocol();
	});
	ModalManager.init();
});

$('.ui.dropdown').dropdown();
$('.menu .item').tab();
$('#loadingData').dimmer('show');
$('.coupled.modal').modal({allowMultiple: true});

$(function() {
	if ($.getUrlParam('id') == null) {
		$('#loadingData').dimmer('hide');
		$("#noDesignErrorModal").modal('setting', 'closable', false).modal('show');
	}
})

$("#backToDesign").click(function() {
	window.location.href = "/design";
});
$(".cancel").click(function() {
	$(".modal").modal("hide");
});