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
var dfs;
var test;

//==========================================================================================
/**
 * @class CNode
 *
 * @method constructor
 *
 */
function CNode() {
    this.view = null;
    this.partType = null;
    this.partName = null;
    this.normalConnNum = 0;
    this.partID = null;
}

CNode.prototype.createCNode = function(partElem) {
    this.view = partElem;
    this.view.attr('normal-connect-num', '0');
    this.view.removeAttr("class");
    this.view.find(".BBa").remove();
    var partType = partElem.attr('part-type');

    if (partType == 'gene' || partType == 'promoter' 
        || partType == 'RBS' || partType == 'terminator') {
        var filterDiv = $("<div></div>");
        filterDiv.addClass("filterDiv");
        filterDiv.appendTo(this.view);
    }
    var minusCircle = Util.createMinusCircleDiv();
    minusCircle.appendTo(this.view);

    this.view.find("img").removeAttr("class");
    this.view.css("text-align", "center");
    this.view.addClass("node");

    var titleDiv = $("<div></div>");
    titleDiv.css("text-align", "center");
    titleDiv.text(this.view.find(".partTitle").text());
    this.view.find("span").replaceWith(titleDiv);
}

CNode.prototype.setCNodeId = function(id) {
    this.partID = id;
}

//-===================================================
function DFS() {
    this.map = [];
}

DFS.prototype.addEdge = function(nodeElemA, nodeElemB) {
    var flagA = false;
    var flagB = false;
    nodeElemA.attr('dirty', '0');
    nodeElemB.attr('dirty','0');
    for (var i in this.map) {
        if (this.map[i][0].attr('part-id') == nodeElemA.attr('part-id')) {
            this.map[i].push(nodeElemB);
            flagA = true;
        }
        if (this.map[i][0].attr('part-id') == nodeElemB.attr('part-id')) {
            this.map[i].push(nodeElemA);
            flagB = true;
        }
    }
    if (flagA == false) {
        var list = [];
        list.push(nodeElemA);
        list.push(nodeElemB);
        this.map.push(list);
    }

    if (flagB == false) {
        var list = [];
        list.push(nodeElemB);
        list.push(nodeElemA);
        this.map.push(list);
    }
};

DFS.prototype.createMap = function() {
    this.map = [];
    var connections = jsPlumb.getAllConnections();
    for (var i in connections) {
        if (connections[i].scope == "normal") {
            this.addEdge($(connections[i].source), $(connections[i].target));
        }
    }
};

DFS.prototype.searchCircuit = function() {
    var circuits = [];
    var queue = [];
    var circuit = [];
    for (var i in this.map) {
        if (this.map[i][0].attr('part-type') == "promoter" &&
            this.map[i][0].attr('normal-connect-num') == "1") {
            queue.push(this.map[i]);
        }
    }
    
    for (var i in queue) {
        circuit = [];
        var head = queue[i];
        if (head[0].dirty == true) continue;
        circuit.push(head[0]);
        head[0].attr('dirty', '1');
        while ((head.length == 2 && head[1].attr('dirty') == '0') || head.length == 3) {
            if (head.length == 2) {
                circuit.push(head[1]);
                head[1].attr('dirty', '1');
                for (var j in this.map) {
                    if (this.map[j][0].attr('part-id') == head[1].attr('part-id')) {
                        head = this.map[j];
                        break;
                    }
                }
            } else {
                var index;
                if (head[1].attr('dirty') == '1') index = 2;
                if (head[2].attr('dirty') == '1') index = 1;
                if (head[1].attr('dirty') == '1' && head[2].attr('dirty') == '1') {
                    console.log("Error !!!");
                    break;
                }
                circuit.push(head[index]);
                head[index].attr('dirty', '1');
                for (var j in this.map) {
                    if (this.map[j][0].attr('part-id') == head[index].attr('part-id')) {
                        head = this.map[j];
                        break;
                    }
                }
            }
        }
        circuits.push(circuit.slice(0, circuit.length));
    }
    console.log(circuits);
    return circuits;
};

DFS.prototype.getCircuits = function() {
    this.createMap();
    var circuitsElems = this.searchCircuit();
    var circuits = [];
    var circuit = [];
    for (var i in circuitsElems) {
        circuit = [];
        for (var j in circuitsElems[i]) {
            var part = DataManager.getPartByAttr(circuitsElems[i][j].attr('part-attr'));
            circuit.push(part);
        }
        circuits.push(circuit);
    }
    return circuits;
}

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
    this.nodeElemList = [];
    this._partCount = 0;
    this.risk = 1;
};

Design.prototype.clear = function() {
    this.nodeElemList = [];
}

Design.prototype.init = function() {
    this._initJsPlumbOption();
    this._makeDrawAreaDroppabble();
    operationLog.init();
    operationLog.openFile();
};

Design.prototype.addProAndInhibitLine = function(partA) {
    var partAttrA = partA.attr('part-attr');
    for (var i in this.nodeElemList) {
        var partB = this.nodeElemList[i];
        var partAttrB = partB.attr('part-attr');
        if (DataManager.isProOrInhibitRelation(partAttrA, partAttrB)) {
            var lineType = DataManager.getLineType(partAttrA, partAttrB);
            this.drawLine(partA, partB, lineType);
        } else if (DataManager.isProOrInhibitRelation(partAttrB, partAttrA)) {
            var lineType = DataManager.getLineType(partAttrB, partAttrA);
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
            if (dropedElement.attr('part-type') == 'device') {
                that.putNewDevice(dropedElement);
                return ;
            }
            console.log("1111");
            console.log($(dropedElement));
            var node = new CNode();
            node.createCNode($(dropedElement));
            $("#drawArea").append(node.view);
            var left = node.view.position().left - leftBar.view.width();
            var top  = node.view.position().top - that.drawMenu.height();
            node.view.css({left:left, top:top});

            that.addPartEvent(node.view);
            //write log
            operationLog.addPart(dropedElement.attr("part-attr"));
        }
    });
}

Design.prototype.addPartEvent = function(elem) {
    this.addDraggable(elem);
    this.addProAndInhibitLine(elem);
    this.makeSourceAndTarget(elem);
    this.nodeElemList.push(elem);
    this._partCount += 1;

    var partAttr = elem.attr("part-attr");
    console.log(partAttr);

    elem.attr('part-id', partAttr + "_" + String(this._partCount));

    //Add to right bar
    // console.log()
    var part = DataManager.getPartByAttr(partAttr);
    rightBar.processDropedPart(part);
    this.updateRisk(part);
} 

Design.prototype.putNewDevice = function(elem) {
    var device = DataManager.getDeviceByTitle(elem.attr('device-name'));
    var parts = device.parts;
    var connections = device.relationship;
    var nodeElems = Util._loadCircuitCNodes(parts);
    Util._loadCircuitLinks(connections, nodeElems);

    rightBar.processDropedDevice(device);
    operationLog.addDevice(elem.attr("device-name"));
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
    jsPlumb.importDefaults({
      PaintStyle : { strokeStyle: "green", lineWidth: 2 },
    });

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

    jsPlumb.bind('connectionDetached', function(info, originalEvent) {
        var target = $(info.connection.target);
        var source = $(info.connection.source);
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (info.connection.scope == "normal") {
            targetNormalNum -= 1;
            sourceNormalNum -= 1;
            source.attr("normal-connect-num", sourceNormalNum);
            target.attr("normal-connect-num", targetNormalNum);
        }
    })

    jsPlumb.on(that.drawArea, "click", ".minus", function() {
        operationLog.removePart($(this.parentNode.parentNode).attr("part-name"));
        that.removeCNodeElem($(this.parentNode.parentNode).attr("part-id"));
        jsPlumb.remove(this.parentNode.parentNode);
    });
};

Design.prototype.getNodeViewByPartId = function(partID) {
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('part-id') == partID) {
            return this.nodeElemList[i];
        }
    }
}

Design.prototype.removeCNodeElem = function(elem) {
    var index2 = this.nodeElemList.indexOf(elem);
    this.nodeElemList.splice(index2, 1);
}

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
        $("#deleteModal").modal('show');
        $("#deleteBtn").click(function() {
            jsPlumb.empty("drawArea");
            design.clear();
            $("#deleteModal").modal('hide');
        });
    });
};

DesignMenu.prototype.enableSaveCircuitchartBtn = function(){
    var that = this;
    this.saveBtn.click(function() {
        $("#saveModal").modal("show");
    });

    $("#saveCircuitBtn").click(function() {
        var there = this;
        var img;
        var curcuitChartData = that.getDesignChartData();
        curcuitChartData.title = $("#curcuitName").val();
        curcuitChartData.introduction = $("#designIntro").val();
        curcuitChartData.source = "hello world";
        curcuitChartData.risk = design.risk;
        curcuitChartData.plasmids = dfs.getCircuits();

        //test
        curcuitChartData.id = -1;

        $("#saveModal").modal("hide");
        $("#saveSuccessModal").modal('show');
        var el = $("#drawArea").get(0);
        html2canvas(el, {
            onrendered: function(canvas) {
                var that = this;
                this.canvas = document.createElement('canvas');
                this.ctx = canvas.getContext('2d');
                this.flows =  $("> svg", el);
                this.flows.each(function() {
                    var svg = $(this)
                    var offset = svg.position();
                    var svgStr = this.outerHTML;
                    that.ctx.drawSvg(svgStr, offset.left, offset.top);
                });

                curcuitChartData.img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                var postDataJson = JSON.stringify(curcuitChartData);
                console.log(postDataJson);
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: '/design/circuit/1',
                    dataType : 'json',
                    data : postDataJson,
                });
            }
        });
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
            partAttr: $elem.attr('part-attr'),
            positionX: parseInt($elem.css("left"), 10),
            positionY: parseInt($elem.css("top"), 10)
        });
    });
    return parts;
}

DesignMenu.prototype.enableLoadCircuitchartBtn = function(curcuitChart) {
    var that = this;
    this.openFileBtn.click(function() {
        var curcuitChart;
        $.get("/design/circuit/1", function(data) {
            var curcuitChart = data["content"];
            var parts = curcuitChart.parts;
            var connections = curcuitChart.relationship;
            var nodeElems = Util._loadCircuitCNodes(parts);
            Util._loadCircuitLinks(connections, nodeElems);
        });
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
        var curcuitName = $("#curcuitDownName").val();
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

            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            Util.downloadImage(curcuitName+".png", image);
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
    var BBa = part.BBa;
    var attr = part.attr;

    var dataDiv = $("<div class='data'></div>");
    var itemDiv = $("<div class='item'></div>");
    var imgElem = $("<img class='ui mini avatar image'/>");
    var titleSpan = $("<span class='partTitle'></span>");
    var iconSpan = $('<span class="more"><i class="zoom icon"></i></span>');
    var BBaSpan = $("<span class='BBa'></span>");
    var leftSpan = $("<span class='leftBox'></span>");

    dataDiv.attr("type", partType);
    itemDiv.attr('id', partName);
    itemDiv.attr('part-type', partType);
    itemDiv.attr('part-name', partName);
    itemDiv.attr('part-attr', attr);
    imgElem.attr("src", Util.getImagePath(partType, 60));
    titleSpan.text(partName);
    iconSpan.attr("data-content", "Read more about this part");
    iconSpan.popup()
    if (BBa != "") {
        BBaSpan.text("("+BBa+")");
    }

    itemDiv.append(imgElem);
    itemDiv.append(titleSpan);
    titleSpan.append(BBaSpan);
    leftSpan.append(itemDiv);
    dataDiv.append(leftSpan);
    dataDiv.append(iconSpan);

    this._makeItJqueryDraggable(itemDiv);

    return dataDiv;
}

SideBarWorker.prototype.addElemToView = function(elem, view) {
    view.append(elem);
    this._makeItJqueryDraggable(elem.find('.item'));
    view.append(Util.createDivider());
}

SideBarWorker.prototype.showView = function(elemsPartList, view) {
    view.empty();
    for (var i in elemsPartList) {
        this.addElemToView(elemsPartList[i], view);
    }
}

SideBarWorker.prototype._makeItJqueryDraggable = function(elem) {
    elem.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
}

SideBarWorker.prototype.createDeviceView = function(device) {
    var dataDiv = $("<div class='data'></div>");
    var itemDiv = $("<div class='item'></div>");
    var imgElem = $("<img/>");
    var titleSpan = $("<span class='deviceTitle'></span>");
    var iconSpan = $("<span class='more'><i class='icon zoom'></i></span>");
    
    imgElem.attr("src", "/static/img/design/device.png");
    titleSpan.text(device.title);
    itemDiv.attr('part-type', 'device');
    itemDiv.attr('device-name', device.title);
    iconSpan.attr("data-content", "Read more about this part");
    iconSpan.popup();

    itemDiv.append(imgElem);
    dataDiv.append(itemDiv);
    dataDiv.append(titleSpan);
    dataDiv.append(iconSpan);

    this._makeItJqueryDraggable(itemDiv);
    return dataDiv
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
    this.view.relates = $("#relates");
    this.view.relateParts = $("#relateParts");
    this.view.relateDevices = $("#relateDevices");
    this.view.relateSystems = $("#relateSystems");

    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];
    //test
    this.elemsPromoterList = [];
    this.elemsRBSList = [];
    this.elemsProteinList = [];
    this.elemsGeneList = [];
    this.elemsTermiList = [];
    this.elemsChemList = [];

    this.view.searchRelateInputBox = $("#searchRelate");
    this.view.searchNewBoxInput = $("#searchNew");

    this.leftbarWorker = new SideBarWorker();
}

LeftBar.prototype.init = function() {
    this._leftTriggerAnimation();
    this.enablesearchNewBoxInput();
    this.enablesearchRelateInputBox();
    $('.ui.styled.accordion').accordion({performance: true});
    $('.menu .item').tab();

    this.enableFilter();
};

LeftBar.prototype.initPart = function(partList) {
    //create left-bar data list
    for (var i in partList) {
        var dataDiv = this.leftbarWorker.createPartView(partList[i]);
        this.elemsPartList.push(dataDiv);
        this.addPartToBar(dataDiv);
        this._searchPartTitle.push({title: partList[i].name});
    }
    this.updateSearchBar();
}

LeftBar.prototype.initDevice = function(deviceList) {
    for (var i in deviceList) {
        var dataDiv = this.leftbarWorker.createDeviceView(deviceList[i]);
        this.elemsDeviceList.push(dataDiv);
        this.addDeviceToBar(dataDiv);
        this._searchDeviceTitle.push({title: deviceList[i].title});
    }
    this.updateSearchBar();
}

LeftBar.prototype.addDeviceToBar = function(elem) {
    this.leftbarWorker.addElemToView(elem, this.view.devices);
}

LeftBar.prototype.addPartToBar = function(elem) {
    var partType = elem.attr("type");
    var elemClone = elem.clone();
    this.leftbarWorker._makeItJqueryDraggable(elemClone.find(".item"));
    elemClone.find(".more").popup();
    if (partType == 'promoter') {
        this.elemsPromoterList.push(elemClone);
    }
    if (partType == 'RBS') {
        this.elemsRBSList.push(elemClone);
    }
    if (partType == 'protein') {
        this.elemsProteinList.push(elemClone);
    }
    if (partType == 'gene') {
        this.elemsGeneList.push(elemClone);
    }
    if (partType == 'terminator') {
        this.elemsTermiList.push(elemClone);
    }
    if (partType == 'chemical' || partType == 'material' || partType == 'unknown' || partType == 'RNA') {
        this.elemsChemList.push(elemClone);
    }

    this.leftbarWorker.addElemToView(elem, this.view.parts);
}

LeftBar.prototype.enableFilter = function() {
    var that = this;
    $("#filterParts").change(function() {
        var partType = $(this).val();
        if (partType == 'promoter') {
            that.leftbarWorker.showView(that.elemsPromoterList, that.view.parts);
        }
        if (partType == 'RBS') {
            that.leftbarWorker.showView(that.elemsRBSList, that.view.parts);
        }
        if (partType == 'protein') {
            that.leftbarWorker.showView(that.elemsProteinList, that.view.parts);
        }
        if (partType == 'gene') {
            that.leftbarWorker.showView(that.elemsGeneList, that.view.parts);
        }
        if (partType == 'terminator') {
            that.leftbarWorker.showView(that.elemsTermiList, that.view.parts);
        }
        if (partType == 'chemical' || partType == 'material' || partType == 'unknown' || partType == 'RNA') {
            that.leftbarWorker.showView(that.elemsChemList, that.view.parts);
        }
        if (partType == 'all') {
            that.leftbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    })
}

LeftBar.prototype.addCustomPart = function(part) {
    var dataDiv = this.leftbarWorker.createPartView(part);
    this.elemsCustomList.push(dataDiv);
    this._searchPartTitle.push({title: part.name});

    this.updateSearchBar();
    this.leftbarWorker.addElemToView(dataDiv, this.view.customs);
}

LeftBar.prototype.updateSearchBar = function() {
    $('#searchPartBox').search({source: this._searchPartTitle});
    $('#searchDeviceBox').search({source: this._searchDeviceTitle});
    $('#searchRelateBox').search({source: this._searchPartTitle});
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

LeftBar.prototype.enablesearchNewBoxInput = function() {
    var that = this;
    this.view.searchNewBoxInput.keyup(function() {
        that.updateSearchBar();
        var val = that.view.searchNewBoxInput.val().toLowerCase();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr").toLowerCase();
                if (partAttr.indexOf(val) != -1) {
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }

            that.leftbarWorker.showView(searchElemPartList, that.view.parts);
        } else {
            that.leftbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    });
};

LeftBar.prototype.enablesearchRelateInputBox = function() {
    var that = this;
    this.view.searchRelateInputBox.keyup(function() {
        var val = that.view.searchRelateInputBox.val().toLowerCase();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr").toLowerCase();
                if (DataManager.isRelate(val, partAttr)) {
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }
            that.leftbarWorker.showView(searchElemPartList, that.view.relates);
        } else {
            that.view.relates.empty();
            that.view.relates.prev().removeClass("active");
            that.view.relates.removeClass("active");
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
    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
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

RightBar.prototype.processDropedDevice = function(device) {
    var deviceElem = this.rightbarWorker.createDeviceView(device);
    if (!this.isDeviceAdded(device)) {
        this.elemsDeviceList.push(deviceElem);
        this._searchDeviceTitle.push({title: device.title});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsPartList, this.view.devices);
    }
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
        if ($(this).text() == part.attr) {
            flag = true;
        }
    })
    return flag;
}

RightBar.prototype.updateAddedView = function(part) {
    var partElem = this.rightbarWorker.createPartView(part);
    if (!this.isPartAdded(part)) {
        this.elemsPartList.push(partElem);
        this._searchPartTitle.push({title: part.name});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
    }
}

RightBar.prototype.isPartAdded = function(part) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i]).find(".partTitle").text() == part.name) {
            return true;
        }
    }
    return false;
}

RightBar.prototype.isDeviceAdded = function(device) {
    for (var i in this.elemsDeviceList) {
        if ($(this.elemsDeviceList[i]).find(".partTitle").text() == device.name) {
            return true;
        }
    }
    return false;
}

RightBar.prototype.updateSearchBar = function() {
    this.view.searchAddBox.search({source: this._searchPartTitle});
}

RightBar.prototype.enableSearchAddBox = function() {
    var that = this;
    this.view.searchAddBox.keyup(function() {
        var val = that.view.searchAddBox.val().toLowerCase();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr").toLowerCase();
                if (partAttr.indexOf(val) != -1) {
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

RightBar.prototype.showEquation = function(partAttrA, partAttrB) {
    var equationStr = DataManager.getEquation(partAttrA, partAttrB);
    var pElem = $("<p></p>");
    pElem.text(equationStr);
    $("#showEquation").append(pElem);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
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
    dfs = new DFS();
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

$("#customCreate").click(function() {
    $('#createCustomPartModal').modal("hide");
    var part = {};
    part.name = $("#customPartName").val();
    part.BBa = $("#customBBaName").val();
    part.type = $("#customPartType").val();
    part.introduction = $("#customIntro").val();
    DataManager.addPart(part);
    leftBar.addCustomPart(part);

});

$("#equationPartA").change(function() {
    var partAttrA = $(this).attr("value");
    var partAttrB = $("#equationPartB").attr("value");
    if (partAttrA != "" && partAttrB != "") {
        rightBar.showEquation(partAttrA, partAttrB);
    }
});

$("#equationPartB").change(function() {
    var partAttrA = $("#equationPartA").attr("value");
    var partAttrB = $(this).attr("value");
    if (partAttrA != "" && partAttrB != "") {
        rightBar.showEquation(partAttrA, partAttrB);
    }
});


$('#loadingData').dimmer('show');


// $('#saveSuccessModal').modal('show');
// $("#deleteModal").modal('show');

$("#moveTo").click(function() {
    window.location.href = "/modal";
}); 