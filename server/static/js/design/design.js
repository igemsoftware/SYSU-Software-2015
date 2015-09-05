/**
 * @file design.js
 * @description Help the user to design circuits and logics
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @data Aug 7 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict";
var operationLog;
var design;
var leftBar;
var rightBar;
var rubberband;
var designMenu;

/**
 * @class OperationLog
 *
 * @method constructor
 *
 */
function OperationLog() {};

OperationLog.prototype.init = function() {
    $.timeago.settings.allowFuture = true;
};

OperationLog.prototype.addPart = function(partName) {
    var message = "Added a <a>" + partName + "</a> part.";
    var EventElem = this._getEventElem("plus icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.removePart = function(partName) {
    var message = "Removed a <a>" + partName + "</a> part.";
    var EventElem = this._getEventElem("remove icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.openFile = function() {
    var message = "Open a new file";
    var EventElem = this._getEventElem("folder open icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.connectPart = function(partNameA, partNameB) {
    var message = "Connected <a>" + partNameA + "</a> and <a>" + partNameB + "</a>.";
    var EventElem = this._getEventElem("compress icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype._getEventElem = function(iconClass, message) {
    var eventDiv = $("<div></div>");
    eventDiv.addClass("event");
    var labelDiv = $("<div></div>");
    labelDiv.addClass("label");
    var icon = $("<i></i>");
    icon.addClass(iconClass);
    icon.appendTo(labelDiv);
    labelDiv.appendTo(eventDiv);

    var contentDiv = $("<div></div>");
    contentDiv.addClass("content");
    var summaryDiv = $("<div></div>");
    summaryDiv.addClass("summary");
    summaryDiv.html(message);
    var timeElem = $("<time></time>");
    timeElem.addClass("date timeago");
    timeElem.attr("datetime", new Date().toISOString());
    timeElem.appendTo(summaryDiv);
    summaryDiv.appendTo(contentDiv);
    contentDiv.appendTo(eventDiv);

    return eventDiv;
};

OperationLog.prototype._writeToRightBar = function(EventElem) {
    $(".ui .feed").prepend(EventElem);
    $("time.timeago").timeago();
};

//==========================================================================================
/**
 * @class Design
 *
 * @method constructor
 *
 */
function Design() {
    this.filterDiv = $(".filterDiv");
    this.nodes = $(".node");
    this.drawArea = $("#drawArea");
    this.drawMenu = $("#drawArea-menu");
    // this._isProOrInhiLink = false;
    this._isPromoteLink = false;
    this._isInhibitLink = false;
    this._putPartElemList = [];
    this._partCount = 0;

    this.risk = 1;
};

Design.prototype.clear = function() {
    this._putPartElemList = [];
}

Design.prototype.init = function() {
    this._initJsPlumbOption();
    this._makeDrawAreaDroppabble();
    operationLog.init();
    operationLog.openFile();
};

Design.prototype.addProAndInhibitLine = function(partA) {
    var partNameA = partA.attr('part-name');
    for (var i in this._putPartElemList) {
        var partB = this._putPartElemList[i];
        var partNameB = partB.attr('part-name');
        if (DataManager.isProOrInhibitRelation(partNameA, partNameB)) {
            var lineType = DataManager.getLineType(partNameA, partNameB);
            this.drawLine(partA, partB, lineType);
        } else if (DataManager.isProOrInhibitRelation(partNameB, partNameA)) {
            var lineType = DataManager.getLineType(partNameB, partNameA);
            this.drawLine(partB, partA, lineType);
        }
    }
};

Design.prototype.drawLine = function(fromPartA, toPartB, lineType) {
    var overlaysClass = this._getOverLaysClass(lineType);
    var strokeStyle = this._getStorkeStyle(lineType);
    if (lineType == "promotion") this._isPromoteLink = true;
    if (lineType == "inhibition") this._isInhibitLink = true;
    // this._isProOrInhiLink = true;
    jsPlumb.connect({
        connector: ["Flowchart"],
        anchor: "Continuous",
        paintStyle: { strokeStyle: strokeStyle, lineWidth: 2 },
        // hoverPaintStyle: { strokeStyle: "blue" },
        source:fromPartA,
        target:toPartB,
        endpoint:"Blank",
        overlays: [overlaysClass],
        allowLoopback: true,
        Container: "drawArea",
        scope: lineType
    });
};

Design.prototype._getStorkeStyle = function(lineType) {
    if (lineType == 'normal') return "green";
    if (lineType == 'inhibition') return "red";
    if (lineType == "promotion") return "blue";
};

Design.prototype._getOverLaysClass = function(lineType) {
    if (lineType == 'normal') return  ["Custom", { create:function(component) {return $("<div></div>");}}];
    if (lineType == 'inhibition') return [ "Diamond", {width:25, length: 1, location:1, foldback:1}];
    if (lineType == "promotion") return ['Arrow', {width:25, length: 15, location:1, foldback:0.3}];
};

Design.prototype._makeDrawAreaDroppabble = function() {
    var that = this;
    this.drawArea.droppable({
        accept: '.item',
        containment: 'drawArea',
        drop:function(e, ui) {
            var dropedElement = ui.helper.clone();
            ui.helper.remove();
            $(dropedElement).removeAttr("class");

            $(dropedElement).find("img").addClass("no-margin");
            $(dropedElement).find("h4").addClass("text-center");
            // $(dropedElement).find("h4").css("bottom", "px");

            var filterDiv = $("<div></div>");
            filterDiv.addClass("filterDiv");
            filterDiv.appendTo(dropedElement);

            var minusCircle = Util.createMinusCircleDiv();
            minusCircle.appendTo(dropedElement);

            $(dropedElement).find("img").removeAttr("class");
            dropedElement.addClass("node");
            dropedElement.appendTo('#drawArea');
            dropedElement.attr("normal-connect-num", 0);

            var left = $(dropedElement).position().left - leftBar.view.width();
            var top  = $(dropedElement).position().top - that.drawMenu.height();

            $(dropedElement).css({left:left, top:top});
            that.addDraggable(dropedElement);
            that.addProAndInhibitLine(dropedElement);
            that.makeSourceAndTarget(dropedElement);

            that._partCount += 1;
            var partName = dropedElement.attr("part-name");
            dropedElement.attr("part-id", partName + "_" + String(that._partCount));

            that._putPartElemList.push(dropedElement);
            //Add to right bar
            var part = DataManager.getPartByName(partName);
            rightBar.processDropedPart(part);
            that.updateRisk(part);
            //write log
            operationLog.addPart(dropedElement.attr("part-name"));
        }
    });
}

Design.prototype.makeSourceAndTarget = function(elem) {
    jsPlumb.makeSource(elem, {
        filter: ".filterDiv",
        connector: ["Flowchart"],
        // connectorStyle: { strokeStyle: "green", lineWidth: 2 },
        anchor: "Continuous",
        endpoint:"Blank",
        overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]],
        allowLoopback: false
    });

    jsPlumb.makeTarget(elem, {
        anchor: "Continuous",
        dropOptions: { hoverClass: "dragHover"},
        endpoint:"Blank",
        allowLoopback: false
    });
};

Design.prototype._initJsPlumbOption = function() {
	var that = this;
    jsPlumb.bind("connection", function(CurrentConnection) {
        var target = $(CurrentConnection.connection.target);
        var source = $(CurrentConnection.connection.source);
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (that._isInhibitLink == true) {
        	CurrentConnection.connection.scope = "inhibition";
            that._isInhibitLink = false;
        } else if (that._isPromoteLink == true) {
        	CurrentConnection.connection.scope = "promotion";
        	that._isPromoteLink = false;
        } else {
            CurrentConnection.connection.scope = "normal";
            if (sourceNormalNum === 2) {
                source.attr("data-content", "Most link to two objects");
                source.popup('show');
                source.removeAttr("data-content");
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            if (targetNormalNum === 2){
                target.attr("data-content", "Most link to two objects");
                target.popup('show');
                target.removeAttr("data-content");
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            sourceNormalNum += 1;
            source.attr("normal-connect-num", sourceNormalNum);
            targetNormalNum += 1;
            target.attr("normal-connect-num", targetNormalNum);

            operationLog.connectPart(source.attr("part-name"), target.attr("part-name"))
        }
    });

    jsPlumb.ready(function() {
        jsPlumb.setContainer(that.drawArea);
    });

    jsPlumb.on(that.drawArea, "click", ".minus", function() {
        operationLog.removePart($(this.parentNode.parentNode).attr("part-name"));
        jsPlumb.remove(this.parentNode.parentNode);
    });
};

Design.prototype.addDraggable = function(elem) {
    jsPlumb.draggable(elem, {
        containment: 'parent',
    })
};

Design.prototype.updateRisk = function(part) {
    if (this.risk < part.risk) {
        this.updateRiskView(part.risk);
    }
}

Design.prototype.updateRiskView = function(risk) {
    var color;
    var popupStr;
    if (risk == 1) {
        color = "green";
        popupStr = "Low risk(1)";
    }
    if (risk == 2) {
        color = "orange";
        popupStr = "Moderate risk(2)"
    }
    if (risk == 3) {
        color = "pink";
        popupStr = "High risk(3)";
    }
    if (risk == 4) {
        color = "red";
        popupStr = "Extreme risk(4)"
    }
    $("#risk").removeClass("green orange pink red");
    $("#risk").addClass(color);
    $("#risk").attr("data-content", popupStr);
    $("#risk").popup("show");
}
//========================================================================================
/**
 * @class Rubberband
 *
 * @method constructor
 *
 */

function Rubberband() {
    this.view = $("#rubberband");
    this.drawArea = $("#drawArea");
    this._x = null;
    this._y = null;
};

Rubberband.prototype.init = function() {
    this._listenDrawAreaMouseMove();
    this._listenDrawAreaMouseDown();
    this._listenDrawAreaMouseup();
    this._listenDrawAreaClick();
}

Rubberband.prototype._listenDrawAreaMouseMove = function() {
    var that = this;
    this.drawArea.mousemove(function(event) {
        if(that.view.is(":visible") !== true) { return; }
             
        // Get the top- and left values
        var t = (event.pageY > that._y) ? that._y : event.pageY;
        var l = (event.pageX >= that._x) ? that._x : event.pageX;
                 
        // Get the width of the rubberband
        var wcalc = event.pageX - that._x;
        var w = (event.pageX > that._x) ? wcalc : (wcalc * -1); 
            
        // Get the height of the rubberband     
        var hcalc = event.pageY - that._y;
        var h = (event.pageY > that._y) ? hcalc : (hcalc * -1); 
     
        // Update the rubberband with the new values
        if (leftBar.isOpenLeftBar == true) {
            l -= leftBar.view.width();
        }
        // t -= drawArea_menu.height();

        that.view.css({top:t, left:l, height:h, width:w, position:'relative'});
    });
};

Rubberband.prototype._listenDrawAreaMouseup = function() {
    var that = this;
    this.drawArea.mouseup(function(event) {
        that._diagramContainerFindSelectedItem();
        that.view.hide();
    });
};

Rubberband.prototype._listenDrawAreaMouseDown = function() {
    var that = this;
    this.drawArea.mousedown(function(event) {
        if ($(event.target).attr("class") == "filterDiv") return;
        that._x = event.pageX;         
        that._y = event.pageY;
                 
        that.view.css({top:that._y, left:that._x, height:1, width:1, position:'relative'});
        that.view.show();
    });
};

Rubberband.prototype._listenDrawAreaClick = function() {
    var that = this;
    this.drawArea.click(function(event) {
        if(that._x === event.pageX && that._y === event.pageY)
        {   
            jsPlumb.clearDragSelection();
            $(".node").each(function() {
                $(this).removeClass("selected");
            });
        }
    });
};

Rubberband.prototype._getTopLeftOffset = function(elem) {
    var elemDimension = {};
    elemDimension.left = elem.offset().left;
    elemDimension.top =  elem.offset().top;
 
    // Distance to the left is: left + width
    elemDimension.right = elemDimension.left + elem.outerWidth();
 
    // Distance to the top is: top + height
    elemDimension.bottom = elemDimension.top + elem.outerHeight();
     
    return elemDimension;
};

Rubberband.prototype._diagramContainerFindSelectedItem = function() {
    if(this.view.is(":visible") !== true) { return; }
    var rubberbandOffset = this._getTopLeftOffset(this.view);
    var that = this;
    $(".node").each(function() {
        var itemOffset = that._getTopLeftOffset($(this));
        if( itemOffset.top > rubberbandOffset.top &&
            itemOffset.left > rubberbandOffset.left &&
            itemOffset.right < rubberbandOffset.right &&
            itemOffset.bottom < rubberbandOffset.bottom) {
            $(this).addClass("selected");
 
            var elementid = $(this).attr('id');
            jsPlumb.addToDragSelection(elementid);
        }
    });
};

//========================================================================================
/**
 * @class DesignMenu
 *
 * @method constructor
 *
 */
function DesignMenu() {
    this.menu = $("#drawArea-menu");
    this.saveBtn = $("#save");
    this.downloadBtn = $("#download");
    this.openFileBtn = $("#openFile");
    this.clearBtn = $("#clear");
    this.connPartBtn = $("#connect-part");
    this.minusBtn = $("#minus");

    this._isMinusBtnOpen = false;
    this._isConnectPartBtnOpen = true;
};

DesignMenu.prototype.init = function() {
    this.enableSaveCircuitchartBtn();
    this.enableDownloadBtn();
    this.enableLoadCircuitchartBtn();
    this.enableClearCircuitchartBtn();
    this.enableConnectPartBtn();
    this.enableRemovePartBtn();
    this.popUpAllButton();

    $("#risk").popup();
}

DesignMenu.prototype.popUpAllButton = function() {
    this.saveBtn.popup();
    this.downloadBtn.popup();
    this.openFileBtn.popup();
    this.clearBtn.popup();
    this.connPartBtn.popup();
    this.minusBtn.popup();
}

DesignMenu.prototype.enableRemovePartBtn = function() {
    var that = this;
    this.minusBtn.click(function() {
        if (that._isMinusBtnOpen == false) {
            that._isMinusBtnOpen = true;
            $(".minusCircle").each(function() {
                $(this).css("display", "block");
            });
        } else {
            that._isMinusBtnOpen = false;
            $(".minusCircle").each(function() {
                $(this).css("display", "none");
            });
        }
    });
}

DesignMenu.prototype.enableConnectPartBtn = function() {
    var that = this;
    this.connPartBtn.click(function() {
        if (that._isConnectPartBtnOpen == true) {
            that._isConnectPartBtnOpen = false;
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that._isConnectPartBtnOpen = true;
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
            });
        }
    });
};

DesignMenu.prototype.enableClearCircuitchartBtn = function() {
    this.clearBtn.click(function() {
        jsPlumb.empty("drawArea");
        design.clear();
    });
};

DesignMenu.prototype.enableSaveCircuitchartBtn = function(){
    this.saveBtn.click(function() {
        $("#saveModal").modal("show");
    });
};

DesignMenu.prototype.getDesignChartData = function() {
    var parts = this.getDesignParts();
    var connections = this.getDesignConns();
    var curcuitChart = {};
    curcuitChart.parts = parts;
    curcuitChart.title = "deviceName";
    curcuitChart.relationship = connections;
    curcuitChart.interfaceA = "interfaceB-partName";
    curcuitChart.interfaceB = "interfaceA-partName";
    return curcuitChart;
}

DesignMenu.prototype.getDesignConns = function() {
	var connections = [];
    $.each(jsPlumb.getAllConnections(), function (idx, CurrentConnection) {
        connections.push({
            start: $(CurrentConnection.source).attr("part-id"),
            end: $(CurrentConnection.target).attr("part-id"),
            type: CurrentConnection.scope
        });
    });
    return connections;
}

DesignMenu.prototype.getDesignParts = function() {
    var parts = []
    $(".node").each(function (idx, elem) {
        var $elem = $(elem);
        parts.push({
            partID: $elem.attr('part-id'),
            partName: $elem.attr('part-name'),
            positionX: parseInt($elem.css("left"), 10),
            positionY: parseInt($elem.css("top"), 10)
        });
    });
    return parts;
}

DesignMenu.prototype.enableLoadCircuitchartBtn = function(curcuitChart) {
    var that = this;
    this.openFileBtn.click(function() {
    	var curcuitChart = {"parts":[{"partID":"Cl_1","partName":"Cl","positionX":185,"positionY":110},{"partID":"Pcl_2","partName":"Pcl","positionX":305,"positionY":121}],"title":"curcuit1","relationship":[{"start":"Cl_1","end":"Pcl_2","type":"inhibition"}],"interfaceA":"Pcl_1","interfaceB":"cl_1"};
        var parts = curcuitChart.parts;
        var connections = curcuitChart.relationship;

        var nodeElems = that._loadCircuitNodes(parts);
        that._loadCircuitLinks(connections, nodeElems);

        //update id
            //     partCount += 1;
            // div.attr("part-id", elem.partName + "_" + String(partCount));
    });

};

DesignMenu.prototype._loadCircuitNodes = function(parts) {
    var nodeElems = [];
    var that = this;
    $.each(parts, function(index, elem ) {
        var node = that._createNewNode(elem);
        node.appendTo(design.drawArea);

        design.addDraggable(node);
        design.addProAndInhibitLine(node);
        design.makeSourceAndTarget(node);

        // putPartElemList.push(div);
        var partID = elem.partID;
        nodeElems.push([partID, node]);
    });

    return nodeElems;
};

DesignMenu.prototype._createNewNode = function(elem) {
    var node = $("<div></div>");
    var left = elem.positionX;
    var top = elem.positionY;
    node.css({left: left, top: top});
    node.css({position: "absolute"});
    node.attr("part-name", elem.partName);
    node.attr("normal-connect-num", 0);
    node.addClass("node");

//need debug
	var partType = DataManager.getPartType(elem.partName)
    var img = Util.createImageDiv(partType);
    img.appendTo(node);

    var titleDiv = Util.createTitleDiv(elem.partName);
    titleDiv.appendTo(node);

    var filterDiv = $("<div></div>");
    filterDiv.addClass("filterDiv");
    filterDiv.appendTo(node);

    var minusCircle = Util.createMinusCircleDiv();
    minusCircle.appendTo(node);

    return node;
};

DesignMenu.prototype._loadCircuitLinks = function(connections, nodeElems) {
    $.each(connections, function(index, elem) {
        // if (elem.type == "promotion" || elem.type == "inhibition") return;
        var startElem;
        var endElem;
        for (var index in nodeElems) {
            if (nodeElems[index][0] == elem.start) startElem = nodeElems[index][1];
            if (nodeElems[index][0] == elem.end) endElem = nodeElems[index][1];
        }
        var startNormalNum = parseInt($(startElem).attr("normal-connect-num"));
        var endNormalNum = parseInt($(endElem).attr("normal-connect-num"));
        startNormalNum += 1;
        endNormalNum += 1;
        $(startElem).attr("normal-connect-num", startNormalNum);
        $(endElem).attr("normal-connect-num", endNormalNum);

        design.drawLine(startElem, endElem, elem.type);
    }); 
};

DesignMenu.prototype.enableDownloadBtn =function() {
	var that = this;
	this.downloadBtn.click(function() {
		$('#downloadModal').modal("show");
	});

	$("#downloadsubmit").click(function() {
		$('#downloadModal').modal("hide");
		var curcuitChartData = that.getDesignChartData();
		var curcuitName = $("#curcuitName").val();
		curcuitChartData.title = curcuitName;
		Util.downloadFile(curcuitName+".txt", JSON.stringify(curcuitChartData));
		that.downloadChartAsImage(curcuitName);
	});
}

DesignMenu.prototype.downloadChartAsImage = function(curcuitName) {
    var el = $("#drawArea").get(0);
    html2canvas(el, {
        onrendered: function(canvas) {
        	var that = this;
            this.canvas = document.createElement('canvas');
    		this.ctx = canvas.getContext('2d');
            // # Render Flows/connections on top of same canvas
            this.flows =  $("> svg", el);

            this.flows.each(function() {
                var svg = $(this)
                var offset = svg.position();
                var svgStr = this.outerHTML;
                that.ctx.drawSvg(svgStr, offset.left, offset.top);
            });

            // $("#main-contain").append(canvas);
            // this.ctx.drawImage(canvas, 0, 0);
            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            Util.downloadImage(curcuitName+".png", image);
            // var dataURL = canvas.toDataURL();
            // console.log(dataURL);
            // ctx.getImageData()
            // $.ajax({
            //   type: "POST",
            //   url: "script.php",
            //   data: { 
            //      imgBase64: dataURL
            //   }
            // }).done(function(o) {
            //   console.log('saved'); 
            //   // If you want the file to be visible in the browser 
            //   // - please modify the callback in javascript. All you
            //   // need is to return the url to the file, you just saved 
            //   // and than put the image in your browser.
            // });
        }
    }); 
};

//========================================================================================
function SideBarWorker() {

}

SideBarWorker.prototype.createPartView = function(part) {
    var partName = part.name;
    var partType = part.type;
    var partIntro = part.introduction;
   
    // var div = $("<div></div>");
    // div.attr('id', partName);
    // div.attr('part-name', partName);
    // div.addClass('item');

    // var img = Util.createImageDiv(partType);
    // img.appendTo(div);

    // var h4 = Util.createTitleDiv(partName);
    // h4.appendTo(div);

    // var dataDiv = $("<div></div>");
    // dataDiv.addClass("data");
    // dataDiv.css("overflow", "hidden");
    // div.appendTo(dataDiv);

    // var span = $("<span></span>");
    // span.text(partIntro);
    // span.appendTo(dataDiv);

    // var btn = Util.createItemBtn();
    // btn.appendTo(dataDiv);
    // btn.popup();

    // this._makeItJqeryDraggable(div);


    //test
    var dataDiv = $("<p></p>");
    dataDiv.text(partName);
    //test
    console.log("createPartView function");
    return dataDiv;
}

SideBarWorker.prototype.addElemToView = function(elem, view) {
    view.append(elem);
    // view.append(Util.createDivider());
    console.log("addElemToView function");
}

SideBarWorker.prototype.showView = function(elemsPartList, view) {
    view.empty();
    for (var i in elemsPartList) {
        this.addElemToView(elemsPartList[i], view);
    }
    console.log("showView function");
}

SideBarWorker.prototype._makeItJqeryDraggable = function(elem) {
    elem.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
}
/**
 * @class LeftBar
 *
 * @method constructor
 *
 */
function LeftBar() {
    this.isOpenLeftBar = false;
    this._leftBarWidth = 400;
    this.view = $("#left-sidebar");
    this.leftTrigger = $(".trigger-left");

    this.view.parts = $("#parts");
    this.view.devices = $("#devices");
    this.view.customs = $("#customs");
    // this.vide.systems = $("#systems");
    this.view.relateParts = $("#relateParts");
    this.view.relateDevices = $("#relateDevices");
    this.view.relateSystems = $("#relateSystems");

    this._searchTitle = [];
    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];

    this.view.searchRelateBox = $("#searchRelate");
    this.view.searchNewBox = $("#searchNew");

    this.leftbarWorker = new SideBarWorker();
}

LeftBar.prototype.init = function() {
    this._leftTriggerAnimation();
    this.enableSearchNewBox();
    this.enableSearchRelateBox();
    $('.ui.styled.accordion').accordion({performance: true});
    $('.menu .item').tab();
};

LeftBar.prototype.initPart = function(partList) {
    //create left-bar data list
    var that = this;
    for (var i in partList) {
    	var dataDiv = this.leftbarWorker.createPartView(partList[i]);
    	this.elemsPartList.push(dataDiv);
    	this._searchTitle.push({title: partList[i].name});
    }
    this.updateSearchBar();
    this.leftbarWorker.showView(this.elemsPartList, this.view.parts);
}

LeftBar.prototype.addCustomPart = function(part) {
	var dataDiv = this.leftbarWorker.createPartView(part);
   	this.elemsCustomList.push(dataDiv);
   	this._searchTitle.push({title: part.name});

   	this.updateSearchBar();
    this.leftbarWorker.addElemToView(dataDiv, this.view.customs);
}

LeftBar.prototype.updateSearchBar = function(box, source) {
	this.view.searchNewBox.search({source: this._searchTitle});
    this.view.searchRelateBox.search({source: this._searchTitle});
}

LeftBar.prototype._leftTriggerAnimation = function() {
    var that = this;
    this.leftTrigger.click(function() {
        var left = that.view.css("left");
        if (parseInt(left) == 0) {
            that.isOpenLeftBar = false;
            that.view.animate({
                left: '-' + that._leftBarWidth + 'px'
            }, 500);

            $("#main-contain").animate({
                left: '0px'
            }, 500);
            that.leftTrigger.find("i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;

            that.view.animate({
                left: '0px'
            }, 500);

            $("#main-contain").animate({
                left: that._leftBarWidth + 'px'
            }, 500);

            that.leftTrigger.find("i").removeClass("right").addClass("left");
        }
    });
}

LeftBar.prototype.enableSearchNewBox = function() {
    var that = this;
    this.view.searchNewBox.keyup(function() {
    	var val = that.view.searchNewBox.val().toLowerCase();
        if (val != "") {
        	var searchElemPartList = [];
        	for (var i in that.elemsPartList) {
        		var partName = $(that.elemsPartList[i].find("div")[0]).attr("part-name").toLowerCase();
        		if (partName.indexOf(val) != -1) {
        			searchElemPartList.push(that.elemsPartList[i]);
        		}
        	}
        	if (searchElemPartList !== []) {
				that.view.parts.prev().addClass("active");
				that.view.parts.addClass("active");
			}
        	that.leftbarWorker.showView(searchElemPartList, that.view.parts);
        } else {
        	that.leftbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    });
};

LeftBar.prototype.enableSearchRelateBox = function() {
	var that = this;
	this.view.searchRelateBox.keyup(function() {
		var val = that.view.searchRelateBox.val().toLowerCase();
		if (val != "") {
			var searchElemPartList = [];
			for (var i in that.elemsPartList) {
				var partName = $(that.elemsPartList[i].find("div")[0]).attr("part-name").toLowerCase();
				if (DataManager.isRelate(val, partName)) {
					searchElemPartList.push(that.elemsPartList[i]);
				}
			}
			if (searchElemPartList !== []) {
				that.view.relateParts.prev().addClass("active");
				that.view.relateParts.addClass("active");
			}
			that.leftbarWorker.showView(searchElemPartList, that.view.relateParts);
		} else {
			that.view.relateParts.empty();
			that.view.relateParts.prev().removeClass("active");
			that.view.relateParts.removeClass("active");
		}
	})
}
//========================================================================================
/**
 * @class RightBar
 *
 * @method constructor
 *
 */
function RightBar() {
    this.rightTrigger = $(".trigger-right");
    this.view = $("#right-sidebar");
    this._isOpenRightBar = false;
    this._rightBarWidth = 400;

    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];

    this.view.parts = $("#addedParts");
    this.view.devices = $("#addedDevices");
    this.view.systems = $("#addedSystems");
    this.view.customs = $("#addedCustoms");
    this.view.searchAddBox = $("#searchAdd");

    this.rightbarWorker = new SideBarWorker();
    this._searchTitle = [];
};

RightBar.prototype.init = function() {
    this._rightTriggerAnimation();
    this.enableSearchAddBox();
}

RightBar.prototype._rightTriggerAnimation = function() {
    var that = this;
    this.rightTrigger.click(function() {
        var right = that.view.css("right");

        if (parseInt(right) == 0) {
            that._isOpenRightBar = false;
            that.view.animate({
                right: '-' + that._rightBarWidth + 'px'
            }, 500);

            that.view.find(".trigger-right > i").removeClass("right").addClass("left");
        } else {
            that._isOpenRightBar = true;

            that.view.animate({
                right: '0px'
            }, 500);
            
            that.view.find(".trigger-right > i").removeClass("left").addClass("right");
        }
    });
};

RightBar.prototype.processDropedPart = function(part) {
    this.updateEquationView(part);
    this.updateAddedView(part);
}

RightBar.prototype.updateEquationView = function(part) {
    if (this.isPartAddedEquationMenu(part)) {
        return;
    } else {
        this.addDropdownItem(part, $("#equationDropdownA .menu"))
        this.addDropdownItem(part, $("#equationDropdownB .menu"))
    }
}

RightBar.prototype.addDropdownItem = function(part, dropdownMenuElem) {
    var itemDiv = $("<div></div>");
    itemDiv.addClass("item");
    itemDiv.attr("data-value", part.name);

    var imgElem = $("<img/>");
    imgElem.addClass("ui mini avatar image");
    imgElem.attr("src", Util.getImagePath(part.type, 70));
    imgElem.appendTo(itemDiv);

    itemDiv.append(part.name);
    dropdownMenuElem.append(itemDiv);
}

RightBar.prototype.isPartAddedEquationMenu = function(part) {
    var flag = false;
    $("#equationDropdownA .menu").each(function() {
        if ($(this).text() == part.name) {
            flag = true;
        }
    })
    return flag;
}

RightBar.prototype.updateAddedView = function(part) {
    var partElem = this.rightbarWorker.createPartView(part);
    if (!this.isPartAdded(part)) {
        this.elemsPartList.push(partElem);
        this._searchTitle.push({title: part.name});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
    }
}

RightBar.prototype.isPartAdded = function(part) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i]).find("h4").text() == part.name) {
            return true;
        }
    }
    return false;
}

RightBar.prototype.updateSearchBar = function() {
    this.view.searchAddBox.search({source: this._searchTitle});
}

RightBar.prototype.enableSearchAddBox = function() {
    var that = this;
    this.view.searchAddBox.keyup(function() {
    	var val = that.view.searchAddBox.val().toLowerCase();
        if (val != "") {
        	var searchElemPartList = [];
        	for (var i in that.elemsPartList) {
        		var partName = $(that.elemsPartList[i].find("div")[0]).attr("part-name").toLowerCase();
        		if (partName.indexOf(val) != -1) {
        			searchElemPartList.push(that.elemsPartList[i]);
        		}
        	}
        	if (searchElemPartList !== []) {
				that.view.parts.prev().addClass("active");
				that.view.parts.addClass("active");
			}
        	that.rightbarWorker.showView(searchElemPartList, that.view.parts);
        } else {
        	that.rightbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    });
};

RightBar.prototype.showEquation = function(partNameA, partNameB) {
    var equation = DataManager.getEquation(partNameA, partNameB);
    console.log(equation);
    var equationStr = Util.renderEquation(equation);
    var pElem = $("<p></p>");
    pElem.text(equationStr);
    $("#showEquation").append(pElem);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
//========================================================================================
/**
 * @class DataManager
 *
 * @method constructor
 *
 */
function DataManager() {
	this.partList = [];
	this.deviceList = [];
	this.relationAdjList = [];
	this.relationShipList = [];
}

DataManager.addPart = function(part) {
	this.partList.push(part);
}

DataManager.addPartList = function(partList) {
	for (var i in partList) this.addPart(partList[i]);
}

DataManager.initPartList = function(partList) {
	this.partList = partList;
}

DataManager.addDevice = function(device) {
	this.deviceList.push(device);
}

DataManager.addDeviceList = function(deviceList) {
	for (var i in deviceList) this.addDevice(deviceList[i]);
}

DataManager.initDeviceList = function(deviceList) {
	this.deviceList = deviceList;
}

DataManager.addRelationAdj = function(relationAdj) {
	this.relationAdjList.push(relationAdj);
}

DataManager.addRelationAdjList = function(relationAdjList) {
	for (var i in relationAdjList) this.addRelationAdj(relationAdjList[i]);
}

DataManager.initRelationAdjList = function(relationAdjList) {
	this.relationAdjList = relationAdjList;
}

DataManager.addRelationShip = function(relationShip) {
	this.relationShipList.push(relationShip);
}

DataManager.addRelationShipList = function(relationShipList) {
	for (var i in relationShipList) this.addRelationShip(relationShipList[i]);
}

DataManager.initRelationShipList = function(relationShipList) {
	this.relationShipList = relationShipList;
}

DataManager.getPartList = function() {
	return this.partList;
}

DataManager.getDeviceList = function() {
	return this.devicesList;
}

DataManager.getSystemList = function() {
	return this.systemList;
}

DataManager.getPartByName = function(partName) {
	for (var i in this.partList) {
		if (this.partList[i].name == partName) return this.partList[i];
	}
	return null;
}

DataManager.getPartType = function(partName) {
	for (var i in this.partList) {
		if (this.partList[i].name == partName) return this.partList[i].type;
	}
    return null;
}

DataManager.getLineType = function(fromPartA, toPartB) {
    for (var i in this.relationShipList) {
        if (this.relationShipList[i].start === fromPartA &&
            this.relationShipList[i].end === toPartB) {
            return this.relationShipList[i].type;
        }
    }
    return null;
};

DataManager.getRelationAdjFromPartName = function(partName) {
	return this.relationAdjList[partName];
}

DataManager.isPartInRelationAdj = function(partName, relationAdj) {
	for (var i in relationAdj) {
		if (partName.toLowerCase() == relationAdj[i].toLowerCase()) {
			return true;
		}
	}
	return false;
}

DataManager.isRelate = function(partNameA, partNameB) {
    for (var i in this.relationShipList) {
    	var start = this.relationShipList[i].start.toLowerCase();
    	var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partNameA.toLowerCase() && end === partNameB.toLowerCase()) ||
            (start === partNameB.toLowerCase() && end === partNameA.toLowerCase())) {
            return true;
        }
    }
    return false;
}

DataManager.getEquation = function(partNameA, partNameB) {
    for (var i in this.relationShipList) {
        var start = this.relationShipList[i].start.toLowerCase();
        var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partNameA.toLowerCase() && end === partNameB.toLowerCase()) ||
            (start === partNameB.toLowerCase() && end === partNameA.toLowerCase())) {
            return this.relationShipList[i].equation;
        }
    }
    return "There are no equation between "+ partNameA + " and " + partNameB;
}

DataManager.isProOrInhibitRelation = function(fromPartA, toPartB) {
    for (var i in this.relationShipList) {
        if (this.relationShipList[i].start === fromPartA &&
            this.relationShipList[i].end === toPartB && 
            (this.relationShipList[i].type == "promotion" ||
                this.relationShipList[i].type == "inhibition")) {
            return true;
        }
    }
    return false;
};

DataManager.getPartDataFromServer = function(callback) {
	var that = this;
    $.get("/design/data/fetch/parts", function(data, status) {
        console.log("Parts:");
        console.log(data['parts']);
        that.initPartList(data['parts']);
        callback(that.getPartList());
    });
}

// DataManager.getRelationShipDataFromServer = function(callback) {
// 	var that = this;
//     $.get("/design/data/fetch/relationship", function(data, status) {
//         console.log("Relationship:");
//         console.log(data['relationship']);
//         that.initRelationShipList(data['relationship']);
//     });
// }

DataManager.getRelationAdjDataFromServer = function(callback) {
	var that = this;
	$.get("/design/data/fetch/adjmatrix", function(data, status) {
        console.log("Adjmatrix:");
        console.log(data['adjmatrix']);
        that.initRelationAdjList(data['adjmatrix']);
    });
}

DataManager.getDeviceDataFromServer = function(callback) {
	var that = this;
    $.get("/design/data/fetch/device", function(data, status) {
        console.log("DeviceList:");
        console.log(data['deviceList']);
        that.initDeviceList(data['deviceList']);
    });
}

//========================================================================================
/**
 * @class Util
 *
 * @method constructor
 *
 */
function Util() {};

Util.getImagePath = function(type, imgSize) {
    // console.log("getImagePath function");
    // return "/static/img/design/"+ type + "_" + imgSize +".png";
    return "";
};

Util.createImageDiv = function(partType) {
    var img = $("<img></img>");
    var imgPath = this.getImagePath(partType, 60);
    img.addClass("ui left floated image no-margin");
    img.attr("src", imgPath);
    return img;
}

Util.createTitleDiv = function(partName) {
    var titleDiv = $("<h4></h4>");
    titleDiv.addClass("ui no-margin text-center");
    titleDiv.text(partName);
    return titleDiv;
}

Util.createMinusCircleDiv = function() {
    var minusCircle = $("<div></div>");
    var icon = $("<i></i>");
    icon.addClass("minus circle icon");
    icon.appendTo(minusCircle);
    minusCircle.addClass("minusCircle");
    return minusCircle;
}

Util.createItemBtn = function() {
    var btn = $("<button></button>");
    btn.addClass("ui mini button");
    btn.attr("data-content", "Read more about this part");
    btn.text("more");
    return btn;
}

Util.createDivider = function() {
	var divider = $("<div></div>");
    divider.addClass("ui inverted divider");
    return divider;
}

Util.downloadFile = function(fileName, content){
	console.log(content);
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    // aLink.href = content;
    aLink.dispatchEvent(evt);
}

Util.downloadImage = function(fileName, content){
    var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = content;
    // aLink.href = content;
    aLink.dispatchEvent(evt);
}

Util.renderEquation = function(e) {
    var res = e.content;  
    for (var key in e.parameters) 
        res=res.replace('{{'+key+'}}', e.parameters[key]); 
    res = "$$ " + res + " $$";
    return res;
}

//===============================================================================
//===============================================================================

$(function() {
    design = new Design();
    leftBar = new LeftBar();
    rightBar = new RightBar();
    rubberband = new Rubberband();
    operationLog = new OperationLog();
    designMenu = new DesignMenu();
    operationLog.init();
    design.init();
    leftBar.init();
    rightBar.init();
    rubberband.init();
    designMenu.init();
    DataManager.getPartDataFromServer(function(partList) {
    	leftBar.initPart(partList);
    });
    DataManager.getDeviceDataFromServer(function(deviceList) {
    	leftBar.initDevice(deviceList);
    });
    DataManager.getRelationAdjDataFromServer();
    DataManager.getRelationShipDataFromServer();
})


//===============================================================================
//===============================================================================
//===============================================================================
//===============================================================================

$("#createCustomPart").click(function() {
	$('#createCustomPartModal').modal("show");
})

$('.dropdown').dropdown();

$(".cancel").each(function() {
	$(this).click(function() {
		$('.modal').modal("hide");
	});
});

$("#customPartType").change(function() {
	var partType = $(this).attr("value");
	$("#customImg").attr("src", "/static/img/design/"+partType+"_70.png");
});

$("#customSubmit").click(function() {
	$('#createCustomPartModal').modal("hide");
	var part = {};
	part.name = $("#customPartName").val();
	console.log(part.name);
	part.type = $("#customPartType").val();
	part.introduction = $("#customIntro").val();
	leftBar.addCustomPart(part);

});

$("#equationPartA").change(function() {
    var partNameA = $(this).attr("value");
    var partNameB = $("#equationPartB").attr("value");
    console.log(partNameA);
    console.log(partNameB);
    if (partNameA != "" && partNameB != "") {
        rightBar.showEquation(partNameA, partNameB);
    }
});

$("#equationPartB").change(function() {
    var partNameA = $("#equationPartA").attr("value");
    var partNameB = $(this).attr("value");
    if (partNameA != "" && partNameB != "") {
        rightBar.showEquation(partNameA, partNameB);
    }
});