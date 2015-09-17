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
var setDrawLineStyle = function() {
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
}

var userGuideModal = $("#userGuideModal");
var circleTab = userGuideModal.children(".circleTab");
var btnArrowLeft = userGuideModal.children(".btn-arrow.left");
var btnArrowRight = userGuideModal.children(".btn-arrow.right");

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
    this.view.attr("data-content", "Most link to two objects");
    this.view.removeAttr("class");
    this.view.find(".BBa").remove();
    var partType = partElem.attr('part-type');

    // if (partType == 'gene' || partType == 'promoter' 
    //     || partType == 'RBS' || partType == 'terminator') {
        var filterDiv = $("<div></div>");
        filterDiv.addClass("filterDiv");
        filterDiv.css('display', 'none');
        filterDiv.appendTo(this.view);
    // }
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
    this.isPromoteLink = false;
    this.isInhibitLink = false;
    this._isNormalLink = false;
    this.nodeElemList = [];
    this._partCount = 0;
    this.risk = 1;
    this.isRemove = false;
    this.designID = -1;
    this.drawAreaHeight = parseInt($("#drawArea").css("height"));
    this.DRAWAREA_HEIGHT = 550;
    this.designName = "New design";
};

Design.prototype.clear = function() {
    this.nodeElemList = [];
    this.risk = 1;
    this.updateRiskView(1);
}

Design.prototype.init = function() {
    this._initJsPlumbOption();
    this._makeDrawAreaDroppabble();
    operationLog.init();
    operationLog.openFile();
    this.setDesignName(this.designName);
};

Design.prototype.setDrawAreaHeight = function(height) {
    this.drawAreaHeight = height;
    $("#drawArea").css("height", this.drawAreaHeight);
    var temp = this.drawAreaHeight - this.DRAWAREA_HEIGHT;
    var val = parseInt((parseFloat(temp*100))/this.DRAWAREA_HEIGHT);
    console.log((parseFloat(temp*100)));
    console.log(this.DRAWAREA_HEIGHT);
    console.log(val);
    $(".slider input").val(val);
}

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
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
    if (lineType == "promotion") this.isPromoteLink = true;
    if (lineType == "inhibition") this.isInhibitLink = true;
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
            var node = new CNode();
            node.createCNode($(dropedElement));
            node.view.css({left: e.pageX, top: e.pageY});
            $("#drawArea").append(node.view);
            var offset = $("#drawArea").offset();
            var left = node.view.position().left - offset.left- 30;
            var top  = node.view.position().top - offset.top - 50;
            node.view.css({left:left, top:top});

            that.addPartEvent(node.view);
            that.addProAndInhibitLine(node.view);
            //write log
            operationLog.addPart(dropedElement.attr("part-attr"));
        }
    });
}

Design.prototype.addPartEvent = function(elem) {
    this.addDraggable(elem);
    // this.addProAndInhibitLine(elem);
    this.makeSourceAndTarget(elem);
    this.nodeElemList.push(elem);
    this._partCount += 1;
    var partAttr = elem.attr("part-attr");
    elem.attr('part-id', partAttr + "_" + String(this._partCount));
    console.log("PartAttr:");
    console.log(partAttr);
    var part = DataManager.getPartByAttr(partAttr);
    console.log('Part:');
    console.log(part);
    rightBar.processDropedPart(part);
    this.updateRisk(part);
} 

Design.prototype.putNewDevice = function(elem) {
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
    var device = DataManager.getDeviceByName(elem.attr('device-name'));
    console.log('Put a device:');
    console.log(device);
    var parts = device.parts;
    var connections = device.relationship;
    var nodeElems = Util._loadCircuitCNodes(parts);
    Util.loadCircuitLinks(connections, nodeElems);
    Util.loadBackbone(device.backbone);
    setDrawLineStyle();
    rightBar.processDropedDevice(device);
    if (designMenu.isHideNormalLine == false) {
        designMenu.hideBtn.click();
    }
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
        if (target.hasClass("dotShape")) {
            CurrentConnection.connection.scope = "backbone";
        } else if (that.isInhibitLink == true) {
            CurrentConnection.connection.scope = "inhibition";
            that.isInhibitLink = false;
        } else if (that.isPromoteLink == true) {
            CurrentConnection.connection.scope = "promotion";
            that.isPromoteLink = false;
        } else {
            CurrentConnection.connection.scope = "normal";
            if (sourceNormalNum == 2) {
                // source.attr("data-content", "Most link to two objects");
                source.popup('show');
                // source.removeAttr("data-content");
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            if (targetNormalNum == 2){
                // target.attr("data-content", "Most link to two objects");
                target.popup('show');
                // target.removeAttr("data-content");
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
        if (target.hasClass("dotShape")) {
            source.remove();
        }
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (that.isRemove == true && info.connection.scope == "normal") {
            targetNormalNum -= 1;
            sourceNormalNum -= 1;
            source.attr("normal-connect-num", sourceNormalNum);
            target.attr("normal-connect-num", targetNormalNum);
        }
    })

    jsPlumb.on(that.drawArea, "click", ".minus", function() {
        that.isRemove = true;
        operationLog.removePart($(this.parentNode.parentNode).attr("part-name"));
        that.removeCNodeElem($(this.parentNode.parentNode).attr("part-id"));
        jsPlumb.remove(this.parentNode.parentNode);
        that.checkDesignRisk();
        that.isRemove = false;
    });
};

Design.prototype.removeCNodeElem = function(partID) {
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('part-id') == partID) {
            var partAttr = this.nodeElemList[i].attr('part-attr');
            this.nodeElemList.splice(i, 1);
            if (!this.isPartInDrawArea(partAttr)) {
                rightBar.removePartViewByAttr(partAttr);
            }
            break;
        }
    }
}

Design.prototype.isPartInDrawArea = function(partAttr) {
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('part-attr') == partAttr) {
            return true;
        }
    }
    return false;
}

Design.prototype.addDraggable = function(elem) {
    jsPlumb.draggable(elem, {
        containment: 'parent', //设置后会导致无法scrollable
        // scroll: true,
        grid: [30, 30],
        drag:function(e){
            if (designMenu.isHideNormalLine == true) {
                $("svg").each(function() {
                    if ($(this).find('path').attr('stroke') == 'green') {
                        $(this).css('display', 'none');
                    }
                });
            }        
        },
        stop: function(e){
            if (designMenu.isHideNormalLine == true) {
                $("svg").each(function() {
                    if ($(this).find('path').attr('stroke') == 'green') {
                        $(this).css('display', 'none');
                    }
                });
            }        
        },
    })
};

Design.prototype.updateRisk = function(part) {
    if (this.risk < part.risk) {
        this.updateRiskView(part.risk);
    }
}

Design.prototype.checkDesignRisk = function() {
    var risk = 1;
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('risk') > risk) {
            risk = this.nodeElemList[i].attr('risk');
        }
    }
    if (risk < this.risk) {
        this.updateRiskView(risk);
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
    $("#riskSpan").attr("data-content", popupStr);
    $("#riskSpan").popup("show");
    setTimeout(function () {  $("#riskSpan").popup("hide"); }, 3000);
}

Design.prototype.setDesignName = function(designName) {
    $("#designName").text(designName);
    this.designName = designName;
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
    this.normalConnBtn = $("#normal-conn");
    this.promotionConnBtn = $("#promotion-conn");
    this.inhibitionConnBtn = $("#inhibition-conn");
    this.minusBtn = $("#minus");
    this.backboneBtn = $("#backbone");
    this.hideBtn = $("#hideNormal");
    this.importPerBtn = $("#importPerBtn");
    this.importForBtn = $("#importForBtn");
    this.importPubBtn = $("#importPubBtn");


    this._isMinusBtnOpen = false;
    // this._isConnectPartBtnOpen = true;
    this.isHideNormalLine = false;
};

DesignMenu.prototype.init = function() {
    this.enableSaveCircuitchartBtn();
    this.enableDownloadBtn();
    this.enableLoadDesignBtn();
    this.enableClearCircuitchartBtn();
    this.enableNormalConnBtn();
    this.enablePromotionConnBtn();
    this.enableInhibitionConnBtn();
    this.enableRemovePartBtn();
    this.enableBackboneBtn();
    this.enableHideNormal();
    this.enableDesignSlider();
    this.popUpAllButton();

    $("#risk").popup();
}

DesignMenu.prototype.enableBackboneBtn = function() {
    this.backboneBtn.click(function() {
        var dotStart = Util.createEndpoint();
        var dotEnd = Util.createEndpoint();
        var offSet = $("#drawArea").offset();
        if (leftBar.isOpenLeftBar == true) {
            offSet.left -= leftBar.view.width();
        }
        dotStart.css({left:offSet.left+100, top: '10px'});
        dotEnd.css({left:offSet.left+300, top:'10px'});
        dotStart.appendTo($("#drawArea"));
        dotEnd.appendTo($("#drawArea"));
        var minusCircle = Util.createMinusCircleDiv();
        minusCircle.appendTo(dotEnd);

        Util.connectBackbone(dotStart, dotEnd);
    });
};

DesignMenu.prototype.popUpAllButton = function() {
    this.saveBtn.popup();
    this.downloadBtn.popup();
    this.openFileBtn.popup();
    this.clearBtn.popup();
    this.normalConnBtn.popup();
    this.promotionConnBtn.popup();
    this.inhibitionConnBtn.popup();
    this.minusBtn.popup();
    this.backboneBtn.popup();
    this.hideBtn.popup();
}

DesignMenu.prototype.enableDesignSlider = function() { 
    $(".slider input").val(0);
    $(".slider input").change(function() {
        var zoom = parseFloat($(this).val())/100;
        var height = parseInt(design.DRAWAREA_HEIGHT);
        $("#drawArea").css("height", String(height*(zoom+1)+'px'));
    });
}

DesignMenu.prototype.enableHideNormal = function() {
    var that = this;
    this.hideBtn.click(function() {
        if (that.isHideNormalLine == false) {
            $(this).addClass("ired");
            that.isHideNormalLine = true;
            $("svg").each(function() {
                if ($(this).find('path').attr('stroke') == 'green') {
                    $(this).css('display', 'none');
                }
            });
        } else {
            $(this).removeClass("ired");
            that.isHideNormalLine = false;
            $("svg").each(function() {
                if ($(this).find('path').attr('stroke') == 'green') {
                    $(this).css('display', 'block');
                }
            });
        }
    });
}

DesignMenu.prototype.enableRemovePartBtn = function() {
    var that = this;
    this.minusBtn.click(function() {
        if (that._isMinusBtnOpen == false) {
            $(this).addClass("ired");
            that._isMinusBtnOpen = true;
            $(".minusCircle").each(function() {
                $(this).css("display", "block");
            });
        } else {
            $(this).removeClass("ired");
            that._isMinusBtnOpen = false;
            $(".minusCircle").each(function() {
                $(this).css("display", "none");
            });
        }
    });
}

DesignMenu.prototype.enableNormalConnBtn = function() {
    var that = this;
    this.normalConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design._isNormalLink = true;
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "green", lineWidth: 2 },
                    Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
                });
            }
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'green');
            });
        }
    });
};

DesignMenu.prototype.enablePromotionConnBtn = function() {
    var that = this;
    this.promotionConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design.isPromoteLink = true
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "blue", lineWidth: 2 },
                    Overlays: [['Arrow', {width:25, length: 15, location:1, foldback:0.3}]]
                });
            };
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'blue');
            });
        }
    });
};

DesignMenu.prototype.enableInhibitionConnBtn = function() {
    var that = this;
    this.inhibitionConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design.isInhibitLink = true;
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "red", lineWidth: 2 },
                    Overlays: [[ "Diamond", {width:25, length: 1, location:1, foldback:1}]]
                });
            }
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'red');
            });
        }
    });
};

DesignMenu.prototype.hightConnBtn = function(connBtn) {
    this.normalConnBtn.removeClass('ired');
    this.promotionConnBtn.removeClass('ired');
    this.inhibitionConnBtn.removeClass('ired');
    connBtn.addClass('ired');
}

DesignMenu.prototype.enableClearCircuitchartBtn = function() {
    var that = this;
    this.clearBtn.click(function() {
        $("#deleteModal").modal({transition: 'bounce'}).modal('show');
        $("#deleteBtn").click(function() {
            jsPlumb.empty("drawArea");
            design.clear();
            rightBar.clear();
            var rubberband = new Rubberband();
            rubberband.init();
            $("#deleteModal").modal('hide');
        });
    });
};

DesignMenu.prototype.enableSaveCircuitchartBtn = function(){
    var that = this;
    this.saveBtn.click(function() {
        $("#secureModal").modal("show");
    });

    $('#continueToSave').click(function() {
        $("#secureModal").modal("hide");
        $('#saveModal').modal('show');
    });

    $("#saveCircuitBtn").click(function() {
        var there = this;
        var img;
        var curcuitChartData = that.getDesignChartData();
        curcuitChartData.name = $("#curcuitName").val();
        curcuitChartData.full_description = $("#designIntro").val();
        curcuitChartData.source = "hello world";
        curcuitChartData.risk = design.risk;
        curcuitChartData.plasmids = dfs.getCircuits();
        curcuitChartData.id = design.designID;

        $("#saveModal").modal("hide");
        $("#saveSuccessModal").modal('show');
        design.setDesignName(curcuitChartData.name);
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
                console.log("Post Data");
                console.log(curcuitChartData);
                var postDataJson = JSON.stringify(curcuitChartData);
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: '/design/data',
                    dataType : 'json',
                    data : postDataJson,
                    success: function(data) {
                        design.designID = data['id'];
                        DataManager.getPerDesignDataFromServer(function(designs) {
                            designMenu.perDesignList = designs;
                        })
                    }
                });
            }
        });
    });
};

DesignMenu.prototype.getDesignChartData = function() {
    var parts = this.getDesignParts();
    var data = this.getDesignConns();
    var curcuitChart = {};
    curcuitChart.parts = parts;
    curcuitChart.relationship = data.connections;
    curcuitChart.interfaceA = "interfaceB-partName";
    curcuitChart.interfaceB = "interfaceA-partName";
    curcuitChart.backbone = data.backbones;
    return curcuitChart;
}

DesignMenu.prototype.getDesignConns = function() {
    var connections = [];
    var backbones = [];
    $.each(jsPlumb.getAllConnections(), function (idx, CurrentConnection) {
        if (CurrentConnection.scope == 'backbone') {
            backbones.push({
                start: [parseInt($(CurrentConnection.source).css('left'), 10), 
                        parseInt($(CurrentConnection.source).css('top'), 10)],
                end: [parseInt($(CurrentConnection.target).css('left'), 10), 
                    parseInt($(CurrentConnection.target).css('top'), 10)]
            });
            return ;
        }
        connections.push({
            start: $(CurrentConnection.source).attr("part-id"),
            end: $(CurrentConnection.target).attr("part-id"),
            type: CurrentConnection.scope
        });
    });
    var data = {};
    data.connections = connections;
    data.backbones = backbones;
    return data;
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

DesignMenu.prototype.enableLoadDesignBtn = function() {
    var that = this;
    var isOpen = false;
    this.openFileBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = true;
        that.initOpenList(that.perDesignList);
    });
    this.importPerBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.perDesignList);
    });
    this.importForBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.forDesignList);
    });
    this.importPubBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.pubDesignList);
    });

    $("#choose").click(function() {
        if (isOpen == true) {
            jsPlumb.empty("drawArea");
            design.clear();
        }
        $("#designList div").each(function() {
            if($(this).hasClass('ired')) {
                var id = $(this).find('input').val();
                design.designID = id;
                var curcuitChart;
                $.get("/design/data/"+design.designID, function(data) {
                    console.log(data["content"]);
                    var curcuitChart = data["content"];
                    var parts = curcuitChart.parts;
                    var connections = curcuitChart.relationship;
                    var backbones = curcuitChart.backbone;
                    var nodeElems = Util._loadCircuitCNodes(parts);
                    Util.loadBackbone(backbones);
                    Util.loadCircuitLinks(connections, nodeElems);
                    design.setDesignName(curcuitChart.name);
                });
            }
        });
        $("#chooseModal").modal('hide');
    });
};

DesignMenu.prototype.initOpenList = function(designs) {
    $("#designList").empty();
    for (var i in designs) {
        var div = $("<div></div>");
        div.text(designs[i].name);
        var idElem = $("<input type='text'></input>");
        idElem.css("display", "none");
        idElem.val(designs[i].id);
        var divider = $("<div class='ui divider'></div>");
        div.append(idElem);
        div.addClass('title')
        div.click(function() {
            $("#designList div").each(function() {
                $(this).removeClass("ired");
            })
            $(this).addClass("ired");
        });
        $("#designList").append(div);
        $("#designList").append(divider);
    }
}

DesignMenu.prototype.enableDownloadBtn =function() {
    var that = this;
    this.downloadBtn.click(function() {
        $('#downloadModal').modal("show");
    });

    $("#downloadsubmit").click(function() {
        $('#downloadModal').modal("hide");
        var curcuitChartData = that.getDesignChartData();
        var curcuitName = $("#curcuitDownName").val();
        curcuitChartData.name = curcuitName;
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
    var partIntro = part.full_description;
    var BBa = part.BBa;
    var attr = part.attr;
    var risk = part.risk;

    var dataDiv = $("<div class='data'></div>");
    var itemDiv = $("<div class='item'></div>");
    var imgElem = $("<img class='ui mini avatar image'/>");
    var titleSpan = $("<span class='partTitle'></span>");
    var iconSpan = $('<span class="more part-more"><i class="zoom icon"></i></span>');
    var BBaSpan = $("<span class='BBa'></span>");
    var leftSpan = $("<span class='leftBox'></span>");

    dataDiv.attr("type", partType);
    itemDiv.attr('id', partName);
    itemDiv.attr('risk', risk);
    itemDiv.attr('part-type', partType);
    itemDiv.attr('part-name', partName);
    itemDiv.attr('part-attr', attr);
    imgElem.attr("src", Util.getImagePath(partType, 60));
    titleSpan.text(partName);
    iconSpan.attr("data-content", "Read more about this part");
    iconSpan.popup();
    this.addReadPartInfoEvent(iconSpan);
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
    var iconSpan = $("<span class='more device-more'><i class='icon zoom'></i></span>");
    
    imgElem.attr("src", "/static/img/design/devices/"+device.name+'.png');
    titleSpan.text(device.name);
    itemDiv.attr('part-type', 'device');
    itemDiv.attr('device-name', device.name);
    iconSpan.attr("data-content", "Read more about this device");
    iconSpan.popup();


    this.addDevicePartInfoEvent(iconSpan);
    itemDiv.append(imgElem);
    dataDiv.append(itemDiv);
    dataDiv.append(titleSpan);
    dataDiv.append(iconSpan);

    this._makeItJqueryDraggable(itemDiv);
    return dataDiv
}

SideBarWorker.prototype.addReadPartInfoEvent = function(moreElem) {
    var that = this;
    moreElem.click(function() {
        var partAttr = $(this).parent().find('.item').attr('part-attr');
        var part = DataManager.getPartByAttr(partAttr);
        that.writePartInfoToModal(part);
        $("#readPartInfoModal").modal({transition: 'horizontal flip'}).modal('show');
    });
}

SideBarWorker.prototype.writePartInfoToModal = function(part) {
    var that = this;
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

SideBarWorker.prototype.addDevicePartInfoEvent = function(moreElem) {
    var that = this;
    moreElem.click(function() {
        var deviceName = $(this).parent().find('.item').attr('device-name');
        var device = DataManager.getDeviceByName(deviceName);
        that.writeDeviceInfoToModal(device);
        $("#readDeviceInfoModal").modal('show');
    });
}

SideBarWorker.prototype.writeDeviceInfoToModal = function(device) {
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
    this.elemsRNAList = [];
    this.elemsMatList = [];
    this.elemsUnkList = [];

    this.view.searchRelateInput = $("#searchRelate");
    this.view.searchPartInput = $("#searchNew");
    this.view.searchDeviceInput = $("#searchDevice");

    this.leftbarWorker = new SideBarWorker();
}

LeftBar.prototype.init = function() {
    this._leftTriggerAnimation();
    this.enableSearchPartBox();
    this.enableSearchRelateBox();
    this.enableSearchDeviceInputBox();
    $('.menu .item').tab();

    this.enableFilter();
};

LeftBar.prototype.initPart = function(partList) {
    //create left-bar data list
    for (var i in partList) {
        var dataDiv = this.leftbarWorker.createPartView(partList[i]);
        this.elemsPartList.push(dataDiv);
        this.addPartToBar(dataDiv);
        this._searchPartTitle.push({title: partList[i].attr});
    }
    this.updateSearchBar();
}

LeftBar.prototype.initDevice = function(deviceList) {
    for (var i in deviceList) {
        var dataDiv = this.leftbarWorker.createDeviceView(deviceList[i]);
        this.elemsDeviceList.push(dataDiv);
        this.addDeviceToBar(dataDiv);
        this._searchDeviceTitle.push({title: deviceList[i].name});
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
    this.leftbarWorker.addReadPartInfoEvent(elemClone.find(".more"));
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
    if (partType == 'chemical') {
        this.elemsChemList.push(elemClone);
    }
    if (partType == 'RNA') {
        this.elemsRNAList.push(elemClone);
    }
    if (partType == 'material') {
        this.elemsMatList.push(elemClone);
    }
    if (partType == 'unknown') {
        this.elemsUnkList.push(elemClone);
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
        if (partType == 'chemical') {
            that.leftbarWorker.showView(that.elemsChemList, that.view.parts);
        }
        if (partType == 'material') {
            that.leftbarWorker.showView(that.elemsMatList, that.view.parts);
        }
        if (partType == 'unknown') {
            that.leftbarWorker.showView(that.elemsUnkList, that.view.parts);
        }
        if (partType == 'RNA') {
            that.leftbarWorker.showView(that.elemsRNAList, that.view.parts);
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
    var that = this;
    $('#searchPartBox').search({
        source: this._searchPartTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");//模拟一个键盘事件
            e.keyCode =13;//keyCode=13是回车
            that.view.searchPartInput.val(value.title);
            that.view.searchPartInput.trigger(e);
        }
    });
    $('#searchDeviceBox').search({
        source: this._searchDeviceTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");//模拟一个键盘事件
            e.keyCode =13;//keyCode=13是回车
            that.view.searchDeviceInput.val(value.title);
            that.view.searchDeviceInput.trigger(e);
        }
    });
    $('#searchRelateBox').search({
        source: this._searchPartTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");//模拟一个键盘事件
            e.keyCode =13;//keyCode=13是回车
            that.view.searchRelateInput.val(value.title);
            that.view.searchRelateInput.trigger(e);
        }
    });
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

            // $("#main-contain").animate({
            //     left: '0px'
            // }, 500);
            $("#drawArea").animate({
                left: '0px'
            }, 500);
            $("#drawArea-menu").animate({
                left: '0px'
            }, 500);
            that.leftTrigger.find("i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;

            that.view.animate({
                left: '0px'
            }, 500);

            // $("#main-contain").animate({
            //     left: that._leftBarWidth + 'px'
            // }, 500);

            $("#drawArea").animate({
                left: that._leftBarWidth + 'px'
            }, 500);
            $("#drawArea-menu").animate({
                left: that._leftBarWidth + 'px'
            }, 500);
            that.leftTrigger.find("i").removeClass("right").addClass("left");
        }
    });
}

LeftBar.prototype.enableSearchPartBox = function() {
    var that = this;
    this.view.searchPartInput.keyup(function() {
        that.updateSearchBar();
        var val = that.view.searchPartInput.val().toLowerCase();
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

LeftBar.prototype.enableSearchRelateBox = function() {
    var that = this;
    this.view.searchRelateInput.keyup(function() {
        var val = that.view.searchRelateInput.val();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr");
                if (DataManager.isRelate(val, partAttr)) {
                    console.log(val);
                    console.log(partAttr);
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }
            that.leftbarWorker.showView(searchElemPartList, that.view.relates);
        } else {
            that.view.relates.empty();
        }
    })
}

LeftBar.prototype.enableSearchDeviceInputBox = function() {
    var that = this;
    this.view.searchDeviceInput.keyup(function() {
        var val = that.view.searchDeviceInput.val().toLowerCase();
        if (val != "") {
            var searchElemDeviceList = [];
            for (var i in that.elemsDeviceList) {
                var deviceName = $(that.elemsDeviceList[i].find("div")[0]).attr("device-name").toLowerCase();
                if (deviceName.indexOf(val) != -1) {
                    searchElemDeviceList.push(that.elemsDeviceList[i]);
                }
            }
            that.leftbarWorker.showView(searchElemDeviceList, that.view.devices);
        } else {
            that.leftbarWorker.showView(that.elemsDeviceList, that.view.devices);
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
    this.view.searchAddInput = $("#searchAddInput");
    this.view.searchAddBox = $("#searchAddBox");
    this.rightbarWorker = new SideBarWorker();
    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
};

RightBar.prototype.init = function() {
    this._rightTriggerAnimation();
    this.enableSearchAddInput();
}

RightBar.prototype.clear = function() {
    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];
    this.view.parts.empty();
    this.view.devices.empty();
    this.view.systems.empty();
    this.view.customs.empty();
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
        this._searchDeviceTitle.push({title: device.name});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsDeviceList, this.view.devices);
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
        this._searchPartTitle.push({title: part.attr});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
    }
}

RightBar.prototype.removePartViewByAttr = function(partAttr) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i].find('.item')).attr('part-attr') == partAttr) {
            this.elemsPartList[i].splice(i, 1);
            this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
            break;
        }
    }
}

RightBar.prototype.isPartAdded = function(part) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i].find('.item')).attr('part-attr') == part.attr) {
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

RightBar.prototype.enableSearchAddInput = function() {
    var that = this;
    this.view.searchAddInput.keyup(function() {
        var val = that.view.searchAddInput.val().toLowerCase();
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

RightBar.prototype.initEquationParts = function(partList) {
    for (var i in partList) {
        var option = $("<option></option>");
        option.attr("value", partList[i].attr);
        option.text(partList[i].attr);
        option.appendTo("#multiParts");
    }
    for (var i in partList) {
        var option = $("<option></option>");
        option.attr("value", partList[i].attr);
        option.text(partList[i].attr);
        option.appendTo("#target");
    }
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
        rightBar.initEquationParts(partList);
    });
    DataManager.getDeviceDataFromServer(function(deviceList) {
        leftBar.initDevice(deviceList);
    });
    DataManager.getPerDesignDataFromServer(function(designs) {
        designMenu.perDesignList = designs;
    })
    DataManager.getForDesignDataFromServer(function(designs) {
        designMenu.forDesignList = designs;
    })
    DataManager.getPubDesignDataFromServer(function(designs) {
        designMenu.pubDesignList = designs;
    })
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
    $("#customImg").attr("src", "/static/img/design/parts/"+partType+"_70.png");
});

$("#customCreate").click(function() {
    $('#createCustomPartModal').modal("hide");
    var part = {};
    part.name = $("#customPartName").val();
    part.BBa = $("#customBBaName").val();
    part.type = $("#customPartType").val();
    part.full_description = $("#customIntro").val();
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

$("#moveTo").click(function() {
    window.location.href = "/modeling?id="+design.designID;
}); 

$(".modal").modal({transition: 'horizontal flip'});

$('.ui.accordion').accordion();

$("#openFormularModal").click(function() {
    $("#formularModal").modal('show');
});

$("#openAddParamModal").click(function() {
    $("#paramModal").modal('show');
});

$('#openAddParamModal').popup();

$("#createParam").click(function() {
    $("#paramModal").modal('hide');
    var coeffName = $("#coeffName").val();
    var coeffNum = $("#coeffNum").val();
    var labelDiv = $("<div class='ui label coeffName'></div>");
    var input = $("<input type='number' class='coeffNum'>");
    labelDiv.text(coeffName);
    input.val(coeffNum);

    var div = $("<div class='ui labeled input'></div>");
    div.append(labelDiv);
    div.append(input);
    div.appendTo($("#coefficient"));
});

$("#createEquationBtn").click(function() {
    var target = $("#target").val();
    var requirement = $("#multiParts").val();
    var formular = $("#formular").val();
    var coeffList = [];
    if (target == null || requirement == null || formular == null || coeffList == null) {
        $("#createEquationErrorModal").modal({transition: 'bounce'}).modal('show');
        return ;
    }
    console.log($("#coefficient").find(".ui.labeled.input"));
    $("#coefficient").find(".ui.labeled.input").each(function() {
        var coeffName = $(this).find(".coeffName").text();
        var coeffNum = $(this).find('.coeffNum').val();
        console.log(coeffName);
        console.log(coeffNum);
        coeffList.push({coeffName: parseInt(coeffNum)});
    });
    var data = {};
    data.target = target;
    data.requirement = requirement;
    data.coeffList = coeffList;
    data.formular = formular;
    var postDataJson = JSON.stringify(data);
    console.log(postDataJson);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/design/equation',
        dataType : 'json',
        data : postDataJson,
        success: function() {
            $("#createEquationSuccessModal").modal('show');
        }
    });
});

// $("#userGuideModal").modal('show');

setTimeout(function(){
    userGuideInit(11,userGuideModal.children(".content"), circleTab),
    $("#btn-userGuide").click(function(){
        userGuideModal.modal("show")
    }),
    userGuideModal.find(".content img").each(function(a){
        0===a? $(this).addClass("ui transition image visible"):$(this).addClass("ui transition image hidden")
    });
    var a =! 0, b = circleTab.children(), c = userGuideModal.find(".content img");
    btnArrowLeft.hide(),
    userGuideModal.children(".btn-arrow").click(function(d){
        var e,f;
        if(a) {
            for (a=!1, btnArrowRight.show(), btnArrowLeft.show(), e=$(d.target), f=0;
                f<c.length&&!c.eq(f).hasClass("visible");
                f++);
            if (e.hasClass("left")){
                if(1===f && btnArrowLeft.hide(), 0===f) return;
                c.eq(f).transition("horizontal flip","300ms"),
                c.eq(f-1).transition("horizontal flip","300ms"),
                b.eq(f).removeClass("actived"),
                b.eq(f-1).addClass("actived")
            } else {
                if(f===c.length-2&&btnArrowRight.hide(),f===c.length-1)
                return;
                c.eq(f).transition("horizontal flip","300ms"),
                c.eq(f+1).transition("horizontal flip","300ms"),
                b.eq(f).removeClass("actived"),
                b.eq(f+1).addClass("actived")
            }
            setTimeout(function(){a=!0},300)
        }
    }),
    b.each(function(a){
        $(this).click(function(){
            var d = $(this);
            d.hasClass("actived") || 
            (circleTab.find(".actived").removeClass("actived"), d.addClass("actived"),
            c.eq(a).transition("horizontal flip","300ms"),
            c.filter(".visible").transition("horizontal flip","300ms")),
            0 === a ? 
                (btnArrowLeft.hide(),btnArrowRight.show()):
                a === b.length-1 ? 
                    (btnArrowLeft.show(),btnArrowRight.hide()):(btnArrowLeft.show(),btnArrowRight.show())
        })
    })
},2e3);

function userGuideInit(a, b, c){
    var d, e;
    for(d = 1; a >= d; d++)
        e = 10 > d ? "0"+d : d, $("<img>").attr("src","/static/img/user_guide/e"+e+".jpg").appendTo(b),
        1 === d ? 
            $("<i>").addClass("circle icon actived").appendTo(c):
            $("<i>").addClass("circle icon").appendTo(c);
    c.css("margin-left", -28*a/2+"px")
}